import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

export default function SignatureScents({ products, catalogError }) {
  const featuredProducts = products
    .filter((product) =>
      !product.isGiftEligible &&
      product.category?.trim().toLowerCase() !== 'atomisers',
    )
    .slice(0, 8)
  return (
    <section aria-labelledby="signature-scents-title" className="my-14 sm:my-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-3 text-xs font-light uppercase tracking-[0.35em] text-gray-400">
          Curated by Cleo
        </p>

        <h2
          id="signature-scents-title"
          className="mb-3 inline-flex items-center gap-2 text-3xl text-gray-500 sm:text-4xl"
        >
          <span>
            SIGNATURE <span className="font-medium text-gray-700">SCENTS</span>
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-gray-700 sm:h-0.5 sm:w-12" />
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
          Discover our most-loved perfumes, selected for everyday elegance,
          lasting impression, and timeless appeal.
        </p>
      </div>

{catalogError && <p className="text-center text-sm" role="status">{catalogError}</p>}

<div className="grid grid-cols-2 gap-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4">
  {featuredProducts.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
      <div className="mt-10 text-center">
        <Link
          to="/collection"
          className="inline-flex rounded-full border border-black bg-black px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#fff] hover:text-[#000] dark:border-[#D4AF37] dark:bg-transparent dark:hover:bg-[#D4AF37] dark:hover:text-[#000]"
        >
          View All Perfumes
        </Link>
      </div>
    </section>
  )
}