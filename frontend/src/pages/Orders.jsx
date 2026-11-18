import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'

export default function Orders() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth()
  const [result, setResult] = useState({
    userId: null,
    orders: [],
    error: '',
    loading: true,
  })

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const controller = new AbortController()
    setResult({ userId, orders: [], error: '', loading: true })

    async function loadOrders() {
      try {
        const token = await getToken()
        if (!token) throw new Error('Please sign in again.')

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/order/userorders`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        )

        const data = await response.json()

        if (!response.ok || !data.success || !Array.isArray(data.orders)) {
          throw new Error(data.message || 'Unable to load orders.')
        }

        if (!controller.signal.aborted) {
          setResult({
            userId,
            orders: [...data.orders].sort((a, b) => b.date - a.date),
            error: '',
            loading: false,
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({ userId, orders: [], error: error.message, loading: false })
        }
      }
    }

    loadOrders()
    return () => controller.abort()
  }, [isLoaded, isSignedIn, userId, getToken])

  if (!isLoaded) return <p role="status" className="py-10">Loading account…</p>

  if (!isSignedIn) {
    return (
      <div className="space-y-3 py-10">
        <p>Sign in to view your orders.</p>
       <Link to="/login?from=orders" className="underline">
  Sign in
</Link>
      </div>
    )
  }

  if (result.loading || result.userId !== userId) {
    return <p role="status" className="py-10">Loading orders…</p>
  }

  return (
    <section className="border-t border-gray-200 py-10">
      <h1 className="mb-8 text-3xl">MY ORDERS</h1>

      {result.error ? (
        <p role="alert">{result.error}</p>
      ) : result.orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {result.orders.map((order) => (
            <article key={order._id} className="rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="break-all font-medium">Order {order._id}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('en-GB', {
                      timeZone: 'Asia/Amman',
                    })}
                  </p>
                </div>
                <p>{order.status}</p>
              </div>

              <ul className="my-4 space-y-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between gap-4">
                    <span>
                      {item.name}
                      <span className="block text-sm text-gray-500">
                        {item.size} × {item.quantity}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-4">
                <p className="text-sm">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                  {' · '}
                  {order.payment ? 'Paid' : 'Unpaid'}
                </p>
                <p className="font-medium">{formatPrice.format(order.amount)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}