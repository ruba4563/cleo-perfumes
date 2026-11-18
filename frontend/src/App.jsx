import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AnnouncementBar from "./components/AnnouncementBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import SignatureScents from "./components/SignatureScents.jsx";
import Collection from "./pages/Collection.jsx";
import Product from "./pages/Product.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Cart from "./pages/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import BestSeller from "./components/BestSeller.jsx";
import CleoExclusive from "./pages/CleoExclusive.jsx";
import Atomisers from "./pages/Atomisers.jsx";
import FragranceQuiz from './pages/FragranceQuiz.jsx'
import GiftSupport from './pages/GiftSupport.jsx'
import FragranceFinder from './components/FragranceFinder.jsx'
import LuxuryBrands from './components/LuxuryBrands.jsx'
import Footer from './components/Footer.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import ScrollToTopButton from './components/ScrollToTopButton.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Profile from './pages/Profile.jsx'
import FreeGifts from './pages/FreeGifts.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );
  const [catalogLoading, setCatalogLoading] = useState(true);
const [loading, setLoading] = useState(true)

useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 1600)
  return () => clearTimeout(timer)
}, [])
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);
  const [products, setProducts] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}, [pathname])
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function openSearch() {
    setSearchOpen(true);
    if (pathname !== "/collection") navigate("/collection");
  }
const [siteSettings, setSiteSettings] = useState(null)

useEffect(() => {
  const controller = new AbortController()

  async function loadSettings() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/settings`,
        { signal: controller.signal },
      )
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load settings')
      }

      setSiteSettings(data.settings)
    } catch (error) {
      if (error.name !== 'AbortError') console.error(error.message)
    }
  }

  loadSettings()
  return () => controller.abort()
}, [])
  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }
  useEffect(() => {
    const controller = new AbortController();
    async function loadCatalog() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/product/list`,
          { signal: controller.signal },
        );

        if (!response.ok)
          throw new Error(`Catalog returned ${response.status}`);

        const data = await response.json();
        if (!data.success || !Array.isArray(data.products)) {
          throw new Error("Invalid catalog response");
        }

        setProducts(data.products);
      } catch (error) {
        if (error.name !== "AbortError") {
          setCatalogError("Unable to load perfumes right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();
    return () => controller.abort();
  }, []);
if (loading) return <LoadingScreen />
  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
      <header className="sticky top-0 z-50 bg-white dark:bg-black">
        <AnnouncementBar
  enabled={siteSettings?.announcementEnabled ?? true}
  messages={
    siteSettings?.announcementMessages ?? [
      'توصيل مجاني للطلبات فوق 25 دينار',
    ]
  }
/>
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <Navbar
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode((current) => !current)}
            products={products}
            onSearch={openSearch}
          />
        </div>
      </header>

      <main className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        {searchOpen && pathname === "/collection" && (
          <SearchBar
            query={searchQuery}
            onChange={setSearchQuery}
            onClose={closeSearch}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero darkMode={darkMode} />
                <SignatureScents
                  products={products}
                  catalogError={catalogError}
                />
                <BestSeller
                  products={products}
                  catalogLoading={catalogLoading}
                  catalogError={catalogError}
                />
                <CleoExclusive
                  embedded
                  products={products}
                  catalogLoading={catalogLoading}
                  catalogError={catalogError}
                />
                <Atomisers
                  embedded
                  products={products}
                  catalogLoading={catalogLoading}
                  catalogError={catalogError}
                />
                <FragranceFinder />
                <LuxuryBrands />
              </>
            }
          />
          <Route
            path="/collection"
            element={
              <Collection
                products={products}
                catalogError={catalogError}
                searchQuery={searchOpen ? searchQuery : ""}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <Product
                products={products}
                catalogError={catalogError}
                catalogLoading={catalogLoading}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                products={products}
                catalogLoading={catalogLoading}
                catalogError={catalogError}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                products={products}
                catalogLoading={catalogLoading}
                catalogError={catalogError}
              />
            }
          />
          <Route
            path="/place-order"
            element={
              <PlaceOrder
                products={products}
                catalogLoading={catalogLoading}
                catalogError={catalogError}
              />
            }
          />
          <Route
            path="/cleo-exclusive"
            element={
              <CleoExclusive
                products={products}
                catalogLoading={catalogLoading}
                catalogError={catalogError}
              />
            }
          />
          <Route
  path="/atomisers"
  element={
    <Atomisers
      products={products}
      catalogLoading={catalogLoading}
      catalogError={catalogError}
    />
  }
/>
<Route
  path="/quiz"
  element={
    <FragranceQuiz
      products={products}
      darkMode={darkMode}
    />
  }
/>
<Route
  path="/gift-support"
  element={<GiftSupport products={products} />}
/>
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
<Route path="/profile" element={<Profile darkMode={darkMode} />} />
<Route
  path="/free-gifts"
  element={<FreeGifts products={products} darkMode={darkMode} />}
/>




          <Route path="*" element={null} />
        </Routes>
      </main>
       <Footer />
       <ToastContainer />
       <ScrollToTopButton />
    </div>
  );
}
