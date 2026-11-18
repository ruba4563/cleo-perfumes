import { Link } from 'react-router-dom'
import lightHero from '../assets/heroo.png'
import darkHero from '../assets/herooDark.png'

export default function Hero({ darkMode }) {
  return (
    <section className="relative min-h-[82vh] w-full overflow-hidden">
      <img
        src={darkMode ? darkHero : lightHero}
        alt="Luxury Perfumes"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45 dark:bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      <div className="relative z-10 flex min-h-[82vh] items-center justify-center px-5 text-center">
        <div className="flex max-w-3xl flex-col items-center text-white">
          <div className="mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-white sm:w-16 dark:bg-[#D4AF37]" />
            <p className="text-xs font-light uppercase tracking-[0.45em] sm:text-sm dark:text-[#D4AF37]">
              Signature Scents
            </p>
            <span aria-hidden="true" className="h-px w-10 bg-white sm:w-16 dark:bg-[#D4AF37]" />
          </div>

          <h1 className="prata-regular text-5xl leading-tight sm:text-7xl lg:text-8xl">
            Discover Your
            <br />
            Signature Scent
          </h1>

          <p className="mt-6 max-w-xl text-sm font-light leading-7 text-white/85 sm:text-lg sm:leading-8">
            Crafted for timeless elegance.
          </p>

          <Link
            to="/collection"
className="mt-9 inline-flex border border-white bg-[#fff] px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#000] transition-all duration-300 hover:bg-transparent hover:text-white sm:px-12 dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:hover:bg-transparent dark:hover:text-[#D4AF37]"          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}