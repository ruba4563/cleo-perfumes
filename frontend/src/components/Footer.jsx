import React from 'react'
import { Link } from 'react-router-dom'
import logoperfume from '../assets/logoperfume.png'

const assets = { logoperfume }
const Footer = () => {
  return (
    <footer className='mt-24 bg-[#0a0a0a] text-white'>
      <div className='px-6 py-16 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] lg:py-20'>
        <div className='grid grid-cols-1 gap-14 md:grid-cols-[2fr_1fr_1fr] lg:gap-20'>
          <div>
            <div className='mb-6 flex flex-col items-start'>
              <img
                src={assets.logoperfume}
                className='w-36 brightness-0 invert'
                alt='Cleo Perfumes'
              />

              <div className='mt-3 flex items-center gap-3'>
                <span className='h-px w-8 bg-[#c9a86a]' />
                <p className='text-[10px] uppercase tracking-[5px] text-[#c9a86a]'>
                  Luxury Perfumes
                </p>
                <span className='h-px w-8 bg-[#c9a86a]' />
              </div>
            </div>

            <p className='max-w-md text-sm leading-8 text-gray-400 sm:text-base'>
              Discover timeless fragrances crafted for elegance and confidence.
              Cleo Perfumes brings you luxurious scents designed to leave a
              lasting impression with every spray.
            </p>
          </div>

          <div>
            <h3 className='mb-6 text-lg font-semibold tracking-[3px] text-[#c9a86a]'>
              COMPANY
            </h3>

            <ul className='flex flex-col gap-4 text-gray-400'>
              <li>
                <Link to='/' className='transition duration-300 hover:text-white'>
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to='/collection'
                  className='transition duration-300 hover:text-white'
                >
                  Collection
                </Link>
              </li>

              <li>
                <Link
                  to='/cleo-exclusive'
                  className='transition duration-300 hover:text-white'
                >
                  Cleo Exclusive
                </Link>
              </li>

              <li>
                <Link
                  to='/about'
                  className='transition duration-300 hover:text-white'
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to='/contact'
                  className='transition duration-300 hover:text-white'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-6 text-lg font-semibold tracking-[3px] text-[#c9a86a]'>
              GET IN TOUCH
            </h3>

            <ul className='flex flex-col gap-4 text-gray-400'>

              <li>
                <a
                  href='mailto:support@cleoperfumes.com'
                  className='transition duration-300 hover:text-white'
                >
                  support@cleoperfumes.com
                </a>
              </li>

              <li>Amman, Jordan</li>
            </ul>
          </div>
        </div>

        <div className='mt-14 border-t border-white/10 pt-6'>
          <p className='text-center text-sm tracking-wide text-gray-500'>
            © {new Date().getFullYear()} Cleo Perfumes. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer