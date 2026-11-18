import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'
import { getCartSummary } from '../utils/getCartSummary.js'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useRef, useState } from 'react'


const deliveryFields = [
  { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
  { name: 'nearestPlace', label: 'Nearest landmark / أقرب معلم', wide: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'state', label: 'Governorate', autoComplete: 'address-level1' },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', wide: true },
]

export default function PlaceOrder({ products, catalogLoading, catalogError }) {
 const { lines, clearCart } = useCart()
const { isLoaded, isSignedIn, getToken } = useAuth()
const [submitting, setSubmitting] = useState(false)
const [orderError, setOrderError] = useState('')
const [orderId, setOrderId] = useState('')
const requestInFlight = useRef(false)
const cartKey = JSON.stringify(lines)
const [quoteVersion, setQuoteVersion] = useState(0)
const [quote, setQuote] = useState({ cartKey: '', loading: true, pricing: null, error: '' })

useEffect(() => {
  let controller
  async function refreshQuote() {
    controller?.abort()
    controller = new AbortController()
    const signal = controller.signal
    if (!lines.length || orderId) return
    setQuote({ cartKey, loading: true, pricing: null, error: '' })
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines }),
        signal,
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to calculate checkout.')
      if (!signal.aborted) setQuote({ cartKey, loading: false, pricing: data.pricing, error: '' })
    } catch (error) {
      if (!signal.aborted) setQuote({ cartKey, loading: false, pricing: null, error: error.message })
    }
  }
  function onVisible() {
    if (document.visibilityState === 'visible') refreshQuote()
  }
  refreshQuote()
  window.addEventListener('focus', onVisible)
  document.addEventListener('visibilitychange', onVisible)
  return () => {
    controller?.abort()
    window.removeEventListener('focus', onVisible)
    document.removeEventListener('visibilitychange', onVisible)
  }
}, [lines, cartKey, quoteVersion, orderId])

const pricing = quote.cartKey === cartKey ? quote.pricing : null
const pricingReady = Boolean(pricing && !quote.loading)
  if (catalogLoading) return <p role="status" className="py-10">Loading checkout…</p>
  if (catalogError) return <p role="status" className="py-10">{catalogError}</p>
if (orderId) {
  return (
    <section className="space-y-4 py-12">
      <h1 className="text-2xl">Order placed</h1>
      <p role="status">Order reference: {orderId}</p>
      <p>Payment method: Cash on Delivery</p>
         <Link to="/orders" className="block underline">
  View my orders
</Link>
      <Link to="/collection" className="underline">Continue shopping</Link>
    </section>
  )
}
  if (lines.length === 0) {
    return (
      <div className="space-y-3 py-10">
        <p>Your cart is empty.</p>
     
        <Link to="/collection" className="underline">Continue shopping</Link>
      </div>
    )
  }

  const { items } = getCartSummary(lines, products)
const hasMissingItems = items.length !== lines.length

async function submitOrder(event) {
  event.preventDefault()

  if (!isLoaded || !isSignedIn || hasMissingItems || !pricingReady || requestInFlight.current) return

  const address = Object.fromEntries(new FormData(event.currentTarget))

  requestInFlight.current = true
  setSubmitting(true)
  setOrderError('')

  try {
    const token = await getToken()
    if (!token) throw new Error('Your session expired. Please sign in again.')

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address, items: lines, quoteKey: pricing.quoteKey }),
    })

    const result = await response.json()

    if (!response.ok || !result.success || !result.orderId) {
      throw new Error(result.message || 'Unable to confirm the order.')
    }

    setOrderId(result.orderId)
    clearCart()
  } catch (error) {
    setQuoteVersion((version) => version + 1)
    setOrderError(
      error instanceof TypeError
        ? 'The connection was interrupted. Check whether the order was saved before trying again.'
        : error.message,
    )
  } finally {
    requestInFlight.current = false
    setSubmitting(false)
  }
}
  return (
    <form 
      onSubmit={submitOrder}
      className="grid gap-12 border-t border-gray-200 py-10 lg:grid-cols-2"
    >
      <section aria-labelledby="delivery-title">
        <h1 id="delivery-title" className="mb-6 text-2xl">DELIVERY INFORMATION</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          {deliveryFields.map(({ name, label, autoComplete, type = 'text', wide }) => (
            <label key={name} className={`block ${wide ? 'sm:col-span-2' : ''}`}>
              <span className="mb-1 block text-sm">{label}</span>
              <input
                name={name}
                type={type}
                autoComplete={autoComplete}
                required
                className="w-full rounded border border-gray-300 px-4 py-2"
              />
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="summary-title">
        <h2 id="summary-title" className="mb-4 text-2xl">ORDER SUMMARY</h2>

        <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={JSON.stringify([item.productId, item.size])} className="flex justify-between gap-4 py-3">
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">{item.size} × {item.quantity}</p>
              </div>
              <span className="shrink-0">{formatPrice.format(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        {items.length < lines.length && (
          <p className="py-3 text-sm">
            Some saved items are unavailable. <Link to="/cart" className="underline">Review your cart</Link>.
          </p>
        )}

        {!pricingReady && (
          <div className="py-4" role="status">
            {quote.error || 'Calculating checkout...'}
            {quote.error && <button type="button" className="ml-3 underline"
              onClick={() => setQuoteVersion((version) => version + 1)}>Retry</button>}
          </div>
        )}

        {pricingReady && <>
        <div className="flex justify-between border-t border-gray-200 py-3 text-sm">
          <span>Delivery fee</span>
          <span>
            {pricing.appliedDiscount ? <>
              <span className="mr-2 text-gray-500 line-through">{formatPrice.format(3)}</span>
              <span>Free</span>
            </> : formatPrice.format(pricing.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 py-4 font-medium">
          <span>Subtotal</span>
          <span>{formatPrice.format(pricing.subtotal)}</span>
        </div>
        {pricing.appliedDiscount && <div className="flex justify-between py-2 text-sm">
          <span>Bundle discount</span>
          <span>-{formatPrice.format(pricing.discountAmount)}</span>
        </div>}
        <div className="flex justify-between border-t border-gray-200 py-4 text-lg font-medium">
          <span>Total</span><span>{formatPrice.format(pricing.total)}</span>
        </div>
        {pricing.appliedDiscount && (
          <div role="status" className="mt-4 rounded border border-[#D4AF37] bg-[#D4AF37]/10 px-4 py-3">
            <p className="font-medium">{pricing.appliedDiscount.name}</p>
            <p className="mt-1 text-sm">
              {pricing.appliedDiscount.quantity} perfumes for {formatPrice.format(pricing.appliedDiscount.bundlePrice)} — free delivery applied.
            </p>
          </div>
        )}
        </>}

        <h2 className="mt-6 text-xl">PAYMENT METHOD</h2>
        <p className="mt-3 rounded border border-gray-300 px-4 py-3">Cash on Delivery</p>

       <button
  type="submit"
  disabled={!isLoaded || !isSignedIn || submitting || hasMissingItems || !pricingReady}
  className="mt-6 bg-black px-8 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#D4AF37] dark:text-[#000]"
>
  {submitting ? 'PLACING ORDER…' : 'PLACE ORDER'}
</button>
      {isLoaded && !isSignedIn && (
  <Link to="/login?from=checkout" className="mt-3 block text-sm underline">
    Sign in to continue checkout
  </Link>
)}

{orderError && (
  <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
    {orderError}
  </p>
)}
      </section>
    </form>
  )
}
