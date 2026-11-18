import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function Wishlist({ products, catalogLoading, catalogError }) {
  const { ids } = useWishlist()
  const savedProducts = products.filter((product) => ids.includes(String(product._id)))

  return (
    <section className="border-t py-10">
      <h1 className="mb-6 text-3xl">MY WISHLIST</h1>

      {catalogLoading ? (
        <p role="status">Loading your wishlist…</p>
      ) : catalogError ? (
        <p role="status">{catalogError}</p>
      ) : savedProducts.length === 0 ? (
        <div className="space-y-3">
          <p>Your wishlist is empty.</p>
          <Link to="/collection" className="underline">Explore the collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {savedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}