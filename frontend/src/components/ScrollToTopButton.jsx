import React, { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!showButton) return null

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black text-white text-xl shadow-lg hover:bg-gray-800 transition'
      aria-label='Scroll to top'
    >
      ↑
    </button>
  )
}

export default ScrollToTopButton