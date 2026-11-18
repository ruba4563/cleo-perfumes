import ProductCard from './ProductCard.jsx'

const normalize = (value) => String(value ?? '').trim().toLowerCase()

function getFragranceTypes(product) {
  return (product.subCategory ?? []).map(normalize).filter(Boolean)
}

export default function RelatedProducts({ product, products }) {
  const category = normalize(product.category)
  const fragranceTypes = new Set(getFragranceTypes(product))

  const related = products.filter((item) =>
    String(item._id) !== String(product._id) &&
    normalize(item.category) === category &&
    !item.isGiftEligible &&
    (fragranceTypes.size === 0 ||
      getFragranceTypes(item).some((type) => fragranceTypes.has(type))),
  ).slice(0, 5)

  if (related.length === 0) return null

  return (
    <section aria-labelledby="related-title" className="my-24">
      <div className="py-2 text-center">
        <h2
          id="related-title"
          className="mb-3 inline-flex items-center gap-2 text-3xl text-gray-500"
        >
          <span>RELATED <span className="font-medium text-gray-700">PRODUCTS</span></span>
          <span aria-hidden="true" className="h-0.5 w-8 bg-gray-700 sm:w-12" />
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {related.map((item) => <ProductCard key={item._id} product={item} />)}
      </div>
    </section>
  )
}