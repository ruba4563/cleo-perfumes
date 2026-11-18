import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'
import RelatedProducts from '../components/RelatedProducts.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'

function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [size, setSize] = useState('')

  const imageEntries = Array.isArray(product.image) ? product.image : [product.image]
  const images = imageEntries
    .map((entry) => typeof entry === 'string' ? entry : entry?.filePath || entry?.secure_url)
    .filter(Boolean)
  const hasOffer = Number(product.offerPrice) > 0
  const inStock = Number(product.stock) > 0
  const sizes = product.sizes ?? []
const { ids, toggleWishlist } = useWishlist()
const saved = ids.includes(String(product._id))
const { lines, addToCart } = useCart()

const quantityInCart = lines.reduce(
  (total, line) =>
    total + (line.productId === String(product._id) ? line.quantity : 0),
  0,
)

const canAdd = inStock && sizes.includes(size) && quantityInCart < Number(product.stock)

  return (
    <article className="border-t-2 border-gray-200 py-10 dark:border-gray-800">
      <div className="flex flex-col gap-12 sm:flex-row">
        <div className="flex min-w-0 flex-1 flex-col-reverse gap-3 sm:flex-row">
          {images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto sm:w-[19%] sm:shrink-0 sm:flex-col">
              {images.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 shrink-0 border sm:w-full ${
                    selectedImage === index
                      ? 'border-black dark:ring-1 dark:ring-inset dark:ring-[#D4AF37]'
                      : 'border-transparent'
                  }`}
                >
                  <img src={url} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="min-w-0 flex-1 self-start bg-gray-100 dark:bg-zinc-900">
            {images.length > 0 ? (
              <img src={images[selectedImage] ?? images[0]} alt={product.name} className="w-full" />
            ) : (
              <p className="p-8 text-center text-sm">Image unavailable</p>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="mt-2 text-2xl font-medium">{product.name}</h1>
<button
  type="button"
  aria-label="Save perfume to wishlist"
  aria-pressed={saved}
  onClick={() => toggleWishlist(product._id)}
  className={`mt-4 rounded-full border px-5 py-2 text-sm transition ${
    saved
      ? 'border-red-300 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300'
      : 'border-gray-300 hover:ring-1 hover:ring-[#D4AF37]'
  }`}
>
  <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
  {' '}
  {saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
</button>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-medium dark:text-[#D4AF37]">
              {formatPrice.format(hasOffer ? product.offerPrice : product.price)}
            </p>
            {hasOffer && (
              <p className="text-xl text-gray-400 line-through">
                {formatPrice.format(product.price)}
              </p>
            )}
          </div>

          <p className={`mt-3 text-sm font-medium ${
            inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </p>

          {product.description && (
            <p dir="auto" className="mt-5 text-start leading-7 text-gray-600">
              {product.description}
            </p>
          )}

          {product.subCategory?.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:w-4/5">
              {product.subCategory.map((note) => (
                <span key={note} className="rounded border border-gray-200 bg-gray-50 px-3 py-3">
                  {note}
                </span>
              ))}
            </div>
          )}

          <fieldset className="my-8">
            <legend className="mb-3">Select Size</legend>
            {sizes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={size === option}
                    disabled={!inStock}
                    onClick={() => setSize(option)}
                    className={`border bg-gray-100 px-4 py-2 disabled:opacity-50 ${
                      size === option
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'border-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Size to be confirmed.</p>
            )}
          </fieldset>

         <button
  type="button"
  disabled={!canAdd}
  onClick={() => addToCart(product, size)}
  className="border border-transparent bg-black px-8 py-3 text-sm text-white dark:bg-[#D4AF37] dark:text-[#000] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-700 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-200"
>
  {!inStock ? 'OUT OF STOCK' : 'ADD TO CART'}
</button>

{inStock && quantityInCart >= Number(product.stock) && (
  <p role="status" className="mt-2 text-sm">
    All available units are already in your cart.
  </p>
)}
        </div>
      </div>
    </article>
  )
}

export default function Product({ products, catalogError, catalogLoading }) {
  const { productId } = useParams()
  const product = products.find((item) => String(item._id) === productId)

  if (catalogLoading) return <p role="status" className="py-10">Loading perfume…</p>
  if (catalogError) return <p role="status" className="py-10">{catalogError}</p>

  if (!product) {
    return (
      <div className="space-y-3 py-10">
        <p>Perfume not found.</p>
        <Link to="/collection" className="underline">Back to Collection</Link>
      </div>
    )
  }

  return (
  <>
    <ProductDetails key={productId} product={product} />
    <RelatedProducts product={product} products={products} />
  </>
)
}