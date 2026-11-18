import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logoperfume.png'
import goldLogo from '../assets/logoperfumeGold.png'
import searchIcon from '../assets/search_icon.png'
import profileIcon from '../assets/profile_icon.png'
import cartIcon from '../assets/cart_icon.png'
import menuIcon from '../assets/menu_icon.png'
import dropdownIcon from '../assets/dropdown_icon.png'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'
import { getCartSummary } from '../utils/getCartSummary.js'
import { useAuth } from '@clerk/clerk-react'

const navigation = [
  { path: '/', label: 'HOME' },
  { path: '/collection', label: 'COLLECTION' },
  { path: '/cleo-exclusive', label: 'CLEO EXCLUSIVE' },
  { path: '/about', label: 'ABOUT' },
  { path: '/contact', label: 'CONTACT' },
]

const iconClass = 'w-5 transition hover:scale-110 dark:invert'

export default function Navbar({ darkMode, onToggleTheme, onSearch ,products  }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { ids } = useWishlist()
const { count, lines } = useCart()
const { items, subtotal } = getCartSummary(lines, products)
  const wishlistCount = products.filter((product) =>
    ids.includes(String(product._id)),
  ).length

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])
const { isLoaded, isSignedIn, signOut } = useAuth()
  return (
    <>
      <nav
        aria-label="Main navigation"
        className="border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-black/90"
      >
        <div className="relative flex h-24 items-center justify-between px-6 lg:px-10">
          <div className="hidden items-center gap-4 text-xs tracking-[2px] text-gray-700 min-[1440px]:flex min-[1700px]:gap-8 min-[1700px]:text-[13px] min-[1700px]:tracking-[3px] dark:text-gray-300">
            {navigation.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'relative text-black transition dark:text-[#d4af37]'
                    : 'relative transition hover:text-black dark:hover:text-[#d4af37]'
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <Link to="/" className="min-[1440px]:absolute min-[1440px]:left-1/2 min-[1440px]:-translate-x-1/2">
            <img
              src={darkMode ? goldLogo : logo}
              alt="Cleo"
              className="w-28 object-contain transition-all duration-300 sm:w-32 lg:w-36"
            />
          </Link>

          <div className="ml-auto flex items-center gap-5">
            <button type="button" aria-label="Search" onClick={onSearch}>
              <img src={searchIcon} alt="" className={iconClass} />
            </button>

            <button
              type="button"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={onToggleTheme}
              className="text-xl transition hover:scale-110"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

           <Link
  to="/wishlist"
  aria-label={`Wishlist, ${wishlistCount} saved`}
  className="relative flex size-5 items-center justify-center transition hover:scale-110"
>
  <span aria-hidden="true" className="text-[33px] leading-none">♡</span>
  {wishlistCount > 0 && (
    <span
      aria-hidden="true"
      className="absolute -bottom-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-0.5 text-[9px] text-white dark:bg-[#D4AF37] dark:text-[#000]"
    >
      {wishlistCount}
    </span>
  )}
</Link>

          {isLoaded && (
  <details className="relative">
    <summary
      aria-label="Account"
      className="list-none cursor-pointer [&::-webkit-details-marker]:hidden"
    >
      <img src={profileIcon} alt="" className={iconClass} />
    </summary>

    <div className="absolute right-0 top-9 z-50 min-w-44 rounded-xl border border-gray-200 bg-[#fff] p-3 text-sm shadow-lg dark:bg-zinc-950">
      {isSignedIn ? (
        <>
        <Link
  to="/profile"
  onClick={(event) => {
    event.currentTarget.closest('details').open = false
  }}
  className="block rounded px-3 py-2 hover:bg-gray-100"
>
  My Profile
</Link>
          <Link
            to="/orders"
            onClick={(event) => {
              event.currentTarget.closest('details').open = false
            }}
            className="block rounded px-3 py-2 hover:bg-gray-100"
          >
            My Orders
          </Link>

          <button
            type="button"
            onClick={() => signOut({ redirectUrl: '/' })}
            className="block w-full rounded px-3 py-2 text-left hover:bg-gray-100"
          >
            Sign out
          </button>
        </>
      ) : (
        <Link to="/login" className="block px-3 py-2">
          Sign in
        </Link>
      )}
    </div>
  </details>
)}

            <div className="relative">
              <button
                type="button"
                aria-label={`Cart, ${count} items`}
                aria-expanded={cartOpen}
                onClick={() => setCartOpen((open) => !open)}
                className="relative z-50"
              >
                <img src={cartIcon} alt="" className={`${iconClass} min-w-5`} />
                <span className="absolute -bottom-[7px] -right-[7px] flex size-4 items-center justify-center rounded-full bg-black text-[9px] text-white dark:bg-[#d4af37] dark:text-black">
                  {count}
                </span>
              </button>

              {cartOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close mini-cart"
                    className="fixed inset-0 z-40"
                    onClick={() => setCartOpen(false)}
                  />
                  <div className="absolute right-0 top-9 z-50 w-[min(300px,calc(100vw-88px))] rounded-xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:w-96 sm:p-6 dark:border-gray-800 dark:bg-zinc-950">
                    <h2 className="text-2xl font-light tracking-wide">View Cart</h2>
                    <p className="mb-5 mt-1 text-sm text-gray-500">
  {count} {count === 1 ? 'item' : 'items'}
</p>

{count === 0 ? (
  <p className="py-8 text-sm text-gray-500">Your cart is empty</p>
) : (
  <div className="max-h-80 overflow-y-auto">
    {items.map((item) => (
      <Link
        key={JSON.stringify([item.productId, item.size])}
        to={`/product/${item.productId}`}
        onClick={() => {
          setCartOpen(false)
          window.scrollTo(0, 0)
        }}
        className="flex gap-4 border-b border-gray-200 py-4 dark:border-gray-800"
      >
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            className="size-20 shrink-0 rounded-md object-cover"
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{item.name}</p>
          <p className="mt-2 text-xs text-gray-500">Size: {item.size}</p>
          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
          <p className="mt-2 font-medium dark:text-[#D4AF37]">
            {formatPrice.format(item.lineTotal)}
          </p>
        </div>
      </Link>
    ))}

    {items.length < lines.length && (
      <p className="py-3 text-sm text-gray-500">
        Some saved items could not be loaded from the catalog.
      </p>
    )}
  </div>
)}

                    <div className="mt-5 flex justify-between border-t pt-5 dark:border-gray-800">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-2xl font-semibold dark:text-[#d4af37]">{formatPrice.format(subtotal)}</span>
                    </div>

                    <Link
                      to="/cart"
                      onClick={() => setCartOpen(false)}
                      className="mt-5 block rounded-md bg-black py-4 text-center text-sm tracking-[2px] text-white dark:bg-[#d4af37] dark:text-black"
                    >
                      VIEW CART
                    </Link>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => {
                setCartOpen(false)
                setMenuOpen(true)
              }}
              className="min-[1440px]:hidden"
            >
              <img src={menuIcon} alt="" className={iconClass} />
            </button>
          </div>
        </div>
      </nav>

      <nav
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-y-0 right-0 z-[60] overflow-hidden bg-white text-gray-700 transition-all duration-300 min-[1440px]:hidden dark:bg-black dark:text-gray-200 ${
          menuOpen ? 'w-[80%]' : 'w-0'
        }`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="flex w-full items-center gap-4 border-b p-5 dark:border-gray-800"
        >
          <img src={dropdownIcon} alt="" className="h-4 rotate-180 dark:invert" />
          Back
        </button>

        {navigation.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={() => setMenuOpen(false)}
            className="block whitespace-nowrap border-b py-4 pl-6 dark:border-gray-800"
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}