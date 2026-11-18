import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'
import { getCartSummary } from '../utils/getCartSummary.js'
import { useAuth } from '@clerk/clerk-react'
import { useRef, useState } from 'react'


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

  const { items, subtotal } = getCartSummary(lines, products)
const hasMissingItems = items.length !== lines.length

async function submitOrder(event) {
  event.preventDefault()

  if (!isLoaded || !isSignedIn || hasMissingItems || requestInFlight.current) return

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
      body: JSON.stringify({ address, items: lines }),
    })

    const result = await response.json()

    if (!response.ok || !result.success || !result.orderId) {
      throw new Error(result.message || 'Unable to confirm the order.')
    }

    setOrderId(result.orderId)
    clearCart()
  } catch (error) {
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

        <div className="flex justify-between border-t border-gray-200 py-4 font-medium">
          <span>Subtotal</span>
          <span>{formatPrice.format(subtotal)}</span>
        </div>

        <h2 className="mt-6 text-xl">PAYMENT METHOD</h2>
        <p className="mt-3 rounded border border-gray-300 px-4 py-3">Cash on Delivery</p>

       <button
  type="submit"
  disabled={!isLoaded || !isSignedIn || submitting || hasMissingItems}
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