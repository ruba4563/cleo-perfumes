import searchIcon from '../assets/search_icon.png'

export default function SearchBar({ query, onChange, onClose }) {
  return (
    <div
      role="search"
      aria-label="Perfume catalog"
      className="flex items-center justify-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-5 dark:border-zinc-800"
    >
      <div className="flex w-full max-w-lg items-center gap-3 rounded-full border border-gray-400 px-5 py-2">
        <input
          type="search"
          aria-label="Search perfumes"
          placeholder="Search"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onClose()
          }}
          autoFocus
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <img src={searchIcon} alt="" className="w-4 shrink-0 dark:invert" />
      </div>

      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="shrink-0 px-2 text-xl leading-none"
      >
        ×
      </button>
    </div>
  )
}