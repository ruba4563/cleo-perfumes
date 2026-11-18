import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const storageKey = 'cleo:wishlist'

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
      return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ids))
  }, [ids])

  function toggleWishlist(productId) {
    const id = String(productId)

    setIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    )
  }

  return (
    <WishlistContext.Provider value={{ ids, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}