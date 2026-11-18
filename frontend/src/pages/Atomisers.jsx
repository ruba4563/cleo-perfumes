import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'

export default function Atomisers({
  products = [],
  catalogLoading,
  catalogError,
  embedded = false,
}) {
  const atomisers = products.filter(
    (product) =>
      String(product.category ?? '').trim().toLowerCase() === 'atomisers',
  )

  if (embedded && (catalogLoading || catalogError || !atomisers.length)) {
    return null
  }

  const Heading = embedded ? 'h2' : 'h1'
  const displayedProducts = embedded ? atomisers.slice(0, 4) : atomisers

  return (
    <section className={embedded ? 'py-24' : 'border-t pb-12 pt-10'}>
      <div className="mb-16 text-center">
        {embedded && (
          <p className="mb-4 text-xs uppercase tracking-[8px] text-[#D4AF37]">
            Cleo Essentials
          </p>
        )}

        <Heading className="prata-regular text-5xl leading-none md:text-7xl">
          Travel
          <span className="mt-2 block text-[#D4AF37]">Atomisers</span>
        </Heading>

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500 dark:text-gray-400">
          Luxury fragrance, always within reach.
          {embedded && ' Designed for travel, nights out, and every moment in between.'}
        </p>
      </div>

      {catalogLoading ? (
        <p role="status" className="text-center">Loading atomisers…</p>
      ) : catalogError ? (
        <p role="status" className="text-center">{catalogError}</p>
      ) : !atomisers.length ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Our travel atomisers are coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {displayedProducts.map((product) => {
            const image = Array.isArray(product.image)
              ? product.image[0]
              : product.image

            const imageUrl = typeof image === 'string'
              ? image
              : image?.filePath || image?.secure_url

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-[35px] bg-[#f8f8f8]"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-110 sm:h-[420px]"
                  />
                ) : (
                  <div className="h-[300px] sm:h-[420px]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 p-4 text-white sm:p-6">
                  <p className="mb-2 text-xs uppercase tracking-[4px] text-[#D4AF37]">
                    Travel Luxury
                  </p>

                  <h3 className="text-lg font-medium sm:text-xl">
                    {product.name}
                  </h3>

                  {!embedded && (
                    <p className="mt-1 text-sm">
                    {formatPrice.format(
                        product.offerPrice > 0
                          ? product.offerPrice
                          : product.price,
                      )}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {embedded && (
        <div className="mt-12 text-center">
          <Link
            to="/atomisers"
            className="inline-flex rounded-full border border-black bg-black px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#fff] hover:text-[#000] dark:border-[#D4AF37] dark:bg-transparent dark:hover:bg-[#D4AF37] dark:hover:text-[#000]"
          >
            Shop Atomisers
          </Link>
        </div>
      )}
    </section>
  )
}