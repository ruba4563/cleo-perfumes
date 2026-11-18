import React from 'react'
import { Link } from 'react-router-dom'

const FragranceFinder = () => {
  return (
    <div className='py-20'>
      <div className='mb-14 text-center'>
        <h2 className='text-3xl font-semibold text-gray-900 dark:text-white md:text-4xl'>
          Discover Your Perfect Fragrance
        </h2>

        <p className='mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400'>
          Explore personalized recommendations and find the fragrance that truly
          matches your style, personality, and occasion.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 text-center text-gray-700 dark:text-gray-200 md:grid-cols-2'>
        <Link
          to='/gift-support'
          className='group rounded-[30px] border border-gray-200 bg-white p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] dark:border-gray-800 dark:bg-[#080808]'
        >
          <div className='mb-6 text-5xl'>🎁</div>

          <p className='mb-3 text-xl font-semibold text-gray-900 dark:text-white'>
            Need Help Choosing a Gift?
          </p>

          <p className='mx-auto mb-6 max-w-md leading-7 text-gray-500 dark:text-gray-400'>
            Answer a few questions and we'll recommend the perfect perfume gift
            from our collection.
          </p>

          <span className='border-b border-black pb-1 text-xs font-semibold tracking-[3px] text-gray-900 dark:border-[#D4AF37] dark:text-[#D4AF37]'>
            START GIFT FINDER
          </span>
        </Link>

        <Link
          to='/quiz'
          className='group rounded-[30px] border border-gray-200 bg-white p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] dark:border-gray-800 dark:bg-[#080808]'
        >
          <div className='mb-6 text-5xl'>✨</div>

          <p className='mb-3 text-xl font-semibold text-gray-900 dark:text-white'>
            Find Your Signature Scent
          </p>

          <p className='mx-auto mb-6 max-w-md leading-7 text-gray-500 dark:text-gray-400'>
            Take our scent quiz and discover the fragrance that matches your
            style and personality.
          </p>

          <span className='border-b border-black pb-1 text-xs font-semibold tracking-[3px] text-gray-900 dark:border-[#D4AF37] dark:text-[#D4AF37]'>
            TAKE THE QUIZ
          </span>
        </Link>
      </div>
    </div>
  )
}

export default FragranceFinder