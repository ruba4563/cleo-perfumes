import React from 'react'
import dior from '../assets/dior.png'
import chanel from '../assets/chanel.png'
import tomford from '../assets/tomford.png'
import ysl from '../assets/ysl.png'
import armani from '../assets/armani.png'
import versace from '../assets/versace.png'

const assets = { dior, chanel, tomford, ysl, armani, versace }
const LuxuryBrands = () => {
  const brands = [
    { img: assets.dior, name: 'Dior' },
    { img: assets.chanel, name: 'Chanel' },
    { img: assets.tomford, name: 'Tom Ford' },
    { img: assets.ysl, name: 'YSL' },
    { img: assets.armani, name: 'Armani' },
    { img: assets.versace, name: 'Versace' },
  ]

  const brandClass =
    'h-16 w-24 md:h-24 md:w-32 object-contain opacity-60 hover:opacity-100 transition duration-300 shrink-0'

  return (
    <div className='overflow-hidden py-14 border-y border-gray-200 bg-white dark:bg-black dark:border-gray-800 mt-24'>
      <div className='text-center mb-10'>
        <p className='text-3xl md:text-4xl font-light tracking-wide text-gray-900 dark:text-white'>
          Featured Luxury Brands
        </p>

        <p className='text-gray-500 dark:text-gray-300 mt-4 text-sm md:text-base'>
          Discover timeless fragrances from the world’s most iconic perfume houses.
        </p>
      </div>

      <div className='overflow-hidden w-full mt-12'>
        <div className='brand-marquee'>
          {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
            <img
              key={index}
              src={brand.img}
              className={brandClass}
              alt={brand.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LuxuryBrands