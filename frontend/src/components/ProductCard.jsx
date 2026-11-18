import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function ProductCard({ product }) {
  const [failedImage, setFailedImage] = useState(null)
  const name = product.name || product.title || 'Product'
  const image = Array.isArray(product.image) ? product.image[0] : product.image
  const imageUrl = typeof image === 'string'
    ? image
    : image?.filePath || image?.secure_url
  const hasOffer = Number(product.offerPrice) > 0
  const inStock = Number(product.stock) > 0
const { ids, toggleWishlist } = useWishlist()
const saved = ids.includes(String(product._id))

  return (
    <div className="relative">
  <button
    type="button"
    aria-label={`Wishlist: ${name}`}
    aria-pressed={saved}
    onClick={() => toggleWishlist(product._id)}
    className={`absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-[#fff] text-lg shadow-md dark:bg-zinc-800 ${
      saved ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-200'
    }`}
  >
    {saved ? '♥' : '♡'}
  </button>
    <Link
      to={`/product/${product._id}`}
      className="block"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <div className="overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
        {imageUrl && failedImage !== imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() => setFailedImage(imageUrl)}
            className="h-64 w-full object-cover transition duration-500 ease-in-out hover:scale-110"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            Image unavailable
          </div>
        )}
      </div>

      <p className="pb-1 pt-3 text-sm text-gray-700 dark:text-gray-100">{name}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatPrice.format(hasOffer ? product.offerPrice : product.price)}
        </span>
        {hasOffer && (
          <span className="text-sm text-gray-400 line-through dark:text-gray-500">
           {formatPrice.format(product.price)}
          </span>
        )}
      </div>
      <p className={`mt-1 text-xs ${
        inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {inStock ? 'In Stock' : 'Out of Stock'}
      </p>
    </Link>
    </div>
  )
}