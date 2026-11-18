import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player'
import catLoader from '../assets/cat-loader.json'

const LoadingScreen = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-white'>
      <div className='text-center'>

        <h1 className='text-5xl prata-regular tracking-[10px] text-black mb-2'>
          CLEO
        </h1>

        <p className='text-sm tracking-[4px] text-gray-500 uppercase mb-2'>
          Luxury Fragrances
        </p>

        <div className='w-[280px] mx-auto'>
          <Player
            autoplay
            loop
            src={catLoader}
          />
        </div>

        <p className='-mt-2 text-xs tracking-[3px] text-gray-400'>
          Preparing your fragrance...
        </p>

      </div>
    </div>
  )
}

export default LoadingScreen