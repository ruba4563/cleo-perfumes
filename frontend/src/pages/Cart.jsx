import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'
import { getCartSummary } from '../utils/getCartSummary.js'

const controlClass = 'size-8 rounded border border-gray-400 disabled:opacity-40'

export default function Cart({ products, catalogLoading, catalogError }) {
  const { lines, addToCart, decreaseQuantity, removeFromCart } = useCart()

  if (catalogLoading) return <p role="status" className="py-10">Loading cart…</p>
  if (catalogError) return <p role="status" className="py-10">{catalogError}</p>

  const { items, subtotal } = getCartSummary(lines, products)

  return (
    <section className="border-t border-gray-200 py-10">
      <h1 className="mb-8 text-3xl">YOUR CART</h1>

      {lines.length === 0 ? (
        <div className="space-y-3">
          <p>Your cart is empty.</p>
          <Link to="/collection" className="underline">Continue shopping</Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
            {lines.map(({ productId, size, quantity }) => {
              const product = products.find((entry) => String(entry._id) === productId)
              const item = items.find(
                (entry) => entry.productId === productId && entry.size === size,
              )
              const totalQuantity = lines
                .filter((line) => line.productId === productId)
                .reduce((total, line) => total + line.quantity, 0)
              const canIncrease = Boolean(
                product?.sizes?.includes(size) && totalQuantity < Number(product.stock),
              )

              return (
                <li
                  key={JSON.stringify([productId, size])}
                  className="flex flex-wrap items-center gap-4 py-5"
                >
                  {item?.imageUrl && (
                    <img src={item.imageUrl} alt="" className="size-20 rounded object-cover" />
                  )}

                  <div className="min-w-0 flex-1">
                    {item ? (
                      <Link to={`/product/${productId}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                    ) : (
                      <p>This perfume is no longer in the catalog.</p>
                    )}
                    <p className="text-sm text-gray-500">Size: {size}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={controlClass}
                      aria-label={`Decrease quantity of ${item?.name ?? 'saved perfume'}, ${size}`}
                      onClick={() => decreaseQuantity(productId, size)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      className={controlClass}
                      aria-label={`Increase quantity of ${item?.name ?? 'saved perfume'}, ${size}`}
                      disabled={!canIncrease}
                      onClick={() => addToCart(product, size)}
                    >
                      +
                    </button>
                  </div>

                  {item && <p className="font-medium">{formatPrice.format(item.lineTotal)}</p>}

                  <button
                    type="button"
                    className="text-sm underline"
                    onClick={() => removeFromCart(productId, size)}
                  >
                    Remove
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-6 font-medium">
            <span>Subtotal</span>
            <span>{formatPrice.format(subtotal)}</span>
          </div>
          <div className="mt-6 text-right">
  <Link
    to="/place-order"
    className="inline-block bg-black px-8 py-3 text-sm text-white dark:bg-[#D4AF37] dark:text-[#000]"
  >
    PROCEED TO CHECKOUT
  </Link>
</div>
        </>
      )}
    </section>
  )
}