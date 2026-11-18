import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'

const categories = ['Men', 'Women', 'Unisex']
const quickFilters = ['All', 'Best Sellers', ...categories]
const fragranceTypes = [
  'Woody', 'Oud', 'Musk', 'Fresh', 'Citrus', 'Floral', 'Sweet',
  'Vanilla', 'Amber', 'Oriental', 'Spicy', 'Leather', 'Fruity',
  'Powdery', 'Aquatic', 'Green', 'Smoky',
]

const normalize = (value) => String(value ?? '').trim().toLowerCase()

function getFragranceTypes(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string' || !value.trim()) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return [value]
  }
}

function FilterChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
        selected
          ? 'border-black bg-black text-white dark:bg-[#D4AF37] dark:text-[#000]'
          : 'border-gray-300 text-gray-700 hover:border-black dark:hover:border-[#D4AF37]'
      }`}
    >
      {label}
    </button>
  )
}

function FilterGroup({ title, options, selected, onSelect }) {
  return (
    <fieldset className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <legend className="sr-only">{title}</legend>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            selected={selected === option}
            onClick={() => onSelect(selected === option ? '' : option)}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default function Collection({ products, catalogError, searchQuery = '' }) {
  const [category, setCategory] = useState('')
  const [fragranceType, setFragranceType] = useState('')
  const [quickFilter, setQuickFilter] = useState('All')
  const [filtersOpen, setFiltersOpen] = useState(false)
 const searchTerm = normalize(searchQuery)

const visibleProducts = products.filter((product) => {
  const productCategory = normalize(product.category)

  if (product.isGiftEligible || productCategory === 'atomisers') return false
  if (searchTerm && !normalize(product.name).includes(searchTerm)) return false
  if (category && productCategory !== normalize(category)) return false

  if (fragranceType && !getFragranceTypes(product.subCategory).some(
    (note) => normalize(note) === normalize(fragranceType),
  )) return false

  if (quickFilter === 'Best Sellers') {
    return Boolean(product.bestseller || product.bestSeller || product.isBestSeller)
  }

  return quickFilter === 'All' || productCategory === normalize(quickFilter)
})

  function clearFilters() {
    setCategory('')
    setFragranceType('')
    setQuickFilter('All')
  }

  return (
    <div className="flex flex-col gap-8 border-t pb-12 pt-10 sm:flex-row sm:gap-10">
      <aside className="sm:w-64 sm:shrink-0">
        <h2 className="my-2 hidden text-2xl font-light uppercase tracking-[0.2em] sm:block">
          Filters
        </h2>

        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="collection-filters"
          onClick={() => setFiltersOpen((open) => !open)}
          className="w-full rounded-full bg-black px-5 py-3 text-sm uppercase tracking-[0.18em] text-white sm:hidden"
        >
          {filtersOpen ? 'Hide filters' : 'Filters'}
        </button>

        <div
          id="collection-filters"
          className={`mt-6 space-y-5 sm:block ${filtersOpen ? 'block' : 'hidden'}`}
        >
          <FilterGroup
            title="Categories"
            options={categories}
            selected={category}
            onSelect={setCategory}
          />
          <FilterGroup
            title="Fragrance Type"
            options={fragranceTypes}
            selected={fragranceType}
            onSelect={setFragranceType}
          />
          {(category || fragranceType || quickFilter !== 'All') && (
            <button type="button" onClick={clearFilters} className="text-sm underline">
              Clear filters
            </button>
          )}
        </div>
      </aside>

      <section aria-labelledby="collection-title" className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 id="collection-title" className="inline-flex items-center gap-2 text-gray-500">
            <span>ALL <span className="font-medium text-gray-700">PERFUMES</span></span>
            <span aria-hidden="true" className="h-0.5 w-12 bg-gray-700" />
          </h1>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((label) => (
              <FilterChip
                key={label}
                label={label}
                selected={quickFilter === label}
                onClick={() => {
                  setQuickFilter(label)
                  setCategory('')
                }}
              />
            ))}
          </div>
        </div>

        {catalogError ? (
          <p role="status" className="text-gray-500">{catalogError}</p>
        ) : visibleProducts.length === 0 ? (
          <p className="text-gray-500">No perfumes found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}