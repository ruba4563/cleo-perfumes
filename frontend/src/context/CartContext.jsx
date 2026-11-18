import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const storageKey = 'cleo:cart'

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]')

    return Array.isArray(saved)
      ? saved.filter((line) =>
          typeof line?.productId === 'string' &&
          typeof line.size === 'string' &&
          Number.isInteger(line.quantity) &&
          line.quantity > 0,
        )
      : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(readCart)
  const count = lines.reduce((total, line) => total + line.quantity, 0)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(lines))
  }, [lines])

  function addToCart(product, size) {
    const productId = String(product._id)
    const stock = Number(product.stock)

    if (!product.sizes?.includes(size) || !Number.isFinite(stock) || stock < 1) {
      return
    }

    setLines((current) => {
      const quantityInCart = current.reduce(
        (total, line) => total + (line.productId === productId ? line.quantity : 0),
        0,
      )

      if (quantityInCart + 1 > stock) return current

      const matchesSize = (line) => line.productId === productId && line.size === size

      if (current.some(matchesSize)) {
        return current.map((line) =>
          matchesSize(line) ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }

      return [...current, { productId, size, quantity: 1 }]
    })
  }
function decreaseQuantity(productId, size) {
  setLines((current) =>
    current
      .map((line) =>
        line.productId === productId && line.size === size
          ? { ...line, quantity: line.quantity - 1 }
          : line,
      )
      .filter((line) => line.quantity > 0),
  )
}

function removeFromCart(productId, size) {
  setLines((current) =>
    current.filter((line) => line.productId !== productId || line.size !== size),
  )
}function decreaseQuantity(productId, size) {
  setLines((current) =>
    current
      .map((line) =>
        line.productId === productId && line.size === size
          ? { ...line, quantity: line.quantity - 1 }
          : line,
      )
      .filter((line) => line.quantity > 0),
  )
}

function removeFromCart(productId, size) {
  setLines((current) =>
    current.filter((line) => line.productId !== productId || line.size !== size),
  )
}
function clearCart() {
  setLines([])
}
  return (
    <CartContext.Provider
  value={{ lines, count, addToCart, decreaseQuantity, removeFromCart, clearCart }}
>
  {children}
</CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}