import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

export default function BestSeller({
  products = [],
  catalogLoading,
  catalogError,
}) {
  const bestSellers = products.filter((product) =>
    Boolean(product.bestseller || product.bestSeller || product.isBestSeller) &&
    !product.isGiftEligible &&
    String(product.category ?? '').trim().toLowerCase() !== 'atomisers',
  ).slice(0, 4)

  if (catalogLoading || catalogError || bestSellers.length === 0) return null

  return (
    <section className="my-16 sm:my-20">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-light uppercase tracking-[0.35em] text-gray-400 dark:text-[#D4AF37]">
          Customer Favorites
        </p>

        <h2 className="inline-flex items-center gap-2 text-3xl text-gray-800 dark:text-white sm:text-4xl">
          <span>
            BEST <span className="font-medium">SELLERS</span>
          </span>
          <span aria-hidden="true" className="h-0.5 w-12 bg-current" />
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400">
          Our most loved fragrances, selected by customers for their
          exceptional scent, performance, and lasting impression.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 gap-y-6 md:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/collection"
          className="inline-flex rounded-full border border-black bg-black px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#fff] hover:text-[#000] dark:border-[#D4AF37] dark:bg-transparent dark:hover:bg-[#D4AF37] dark:hover:text-[#000]"
        >
          View All Perfumes
        </Link>
      </div>
    </section>
  )
}