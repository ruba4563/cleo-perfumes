import ProductCard from '../components/ProductCard.jsx'

export default function CleoExclusive({
  products = [],
  catalogLoading,
  catalogError,
  embedded = false,
}) {
  const cleoProducts = products.filter(
    (product) =>
      String(product.category ?? '').trim().toLowerCase() === 'cleo exclusive',
  )

  const Heading = embedded ? 'h2' : 'h1'

  return (
    <section className="px-4 py-12 sm:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gray-400">
          CLEO PERFUMES
        </p>

        <Heading className="text-4xl font-light uppercase tracking-[0.15em] sm:text-5xl">
          Cleo Exclusive
        </Heading>

        <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
          Discover our signature fragrances, crafted exclusively for Cleo.
        </p>
      </div>

      {catalogLoading ? (
        <p role="status" className="text-center text-gray-500">
          Loading fragrances…
        </p>
      ) : catalogError ? (
        <p role="status" className="text-center text-gray-500">
          {catalogError}
        </p>
      ) : cleoProducts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Our exclusive collection is coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {cleoProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}