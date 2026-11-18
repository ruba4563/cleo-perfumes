import React from 'react'
import contact_img from '../assets/contact_img.png'
import LuxuryBrands from '../components/LuxuryBrands'

const assets = { contact_img }

const Contact = () => {
  const instagramLink = 'https://www.instagram.com/cleoperfumes1/'
  const ordersLink = '/orders'

  const contactCards = [
    {
      icon: '📸',
      title: 'Instagram Concierge',
      text: 'Need help choosing a scent? Message us directly on Instagram.',
      action: 'MESSAGE US',
      link: instagramLink
    },
   {
  icon: '🎁',
  title: 'Gift Support',
  text: 'Answer a few questions and we’ll help you find the perfect perfume gift.',
  action: 'START QUIZ',
  link: '/gift-support'
},
    {
      icon: '📦',
      title: 'Order Assistance',
      text: 'Track your orders or contact us on Instagram for help.',
      action: 'MY ORDERS',
      link: ordersLink
    }
  ]

  return (
    <div className='border-t'>
      <section className='relative min-h-[70vh] flex items-center overflow-hidden rounded-b-[40px] bg-black text-white'>
        <img
          src={assets.contact_img}
          alt='Contact Cleo'
          className='absolute inset-0 w-full h-full object-cover opacity-35'
        />

        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30'></div>

        <div className='relative z-10 max-w-3xl px-6 md:px-16'>
          <p className='text-xs tracking-[6px] uppercase text-[#D4AF37] mb-5'>
            Cleo Concierge
          </p>

          <h1 className='prata-regular text-5xl md:text-7xl leading-tight'>
            Let’s Find Your
            <br />
            Next Signature.
          </h1>

          <p className='mt-6 text-gray-300 leading-7 max-w-xl'>
            Whether you need help choosing a perfume, tracking an order, or finding
            the perfect gift, the Cleo team is here to guide your fragrance journey.
          </p>

          <div className='flex flex-wrap gap-4 mt-8'>
            <a
              href={instagramLink}
              target='_blank'
              rel='noreferrer'
className='inline-flex rounded-full border border-white bg-black px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-white transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-gradient-to-r hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:shadow-lg hover:shadow-pink-500/30 dark:border-[#D4AF37] dark:bg-transparent dark:text-white dark:hover:border-transparent dark:hover:bg-gradient-to-r dark:hover:from-[#F58529] dark:hover:via-[#DD2A7B] dark:hover:to-[#8134AF] dark:hover:text-white'>
              INSTAGRAM US
            </a>
          </div>
        </div>
      </section>

      <section className='py-20 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {contactCards.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target={item.link.startsWith('http') ? '_blank' : '_self'}
            rel={item.link.startsWith('http') ? 'noreferrer' : undefined}
            className='border border-gray-200 dark:border-gray-800 rounded-3xl p-8 bg-white dark:bg-[#080808] hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] transition-all duration-300'
          >
            <div className='text-4xl mb-6'>{item.icon}</div>

            <h3 className='text-xl font-semibold mb-4'>
              {item.title}
            </h3>

            <p className='text-sm text-gray-500 dark:text-gray-400 leading-7 mb-6'>
              {item.text}
            </p>

            <span className='text-xs tracking-[3px] font-semibold border-b border-black dark:border-[#D4AF37] pb-1'>
              {item.action}
            </span>
          </a>
        ))}
      </section>

      <section className='mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch'>
        <div className='bg-[#faf8f3] dark:bg-[#0b0b0b] rounded-[35px] p-8 md:p-12'>
          <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-4'>
            Online Store
          </p>

          <h2 className='prata-regular text-4xl md:text-5xl mb-8'>
            We’re Always Online
          </h2>

          <div className='space-y-6 text-gray-600 dark:text-gray-300'>
            <p>
              <span className='font-semibold text-black dark:text-white'>Location:</span>
              {' '}Online only
            </p>

            <p>
              <span className='font-semibold text-black dark:text-white'>Instagram:</span>
              {' '}@cleoperfumes1 & @cleoperfumes2
            </p>

            <p>
              <span className='font-semibold text-black dark:text-white'>Orders:</span>
              {' '}Track your order anytime from your account.
            </p>

            <p>
              <span className='font-semibold text-black dark:text-white'>Hours:</span>
              {' '}Open 24/7
            </p>
          </div>
        </div>

        <div className='relative min-h-[360px] rounded-[35px] overflow-hidden bg-black text-white flex items-center justify-center p-10 text-center'>
          <div>
            <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-5'>
              Need Help?
            </p>

            <h3 className='prata-regular text-4xl md:text-5xl'>
              Message Us Anytime
            </h3>

            <p className='mt-5 text-gray-400 max-w-md mx-auto leading-7'>
              We are an online perfume store, available 24/7 to help you with gifts,
              scent recommendations, and order assistance.
            </p>

            <a
              href={instagramLink}
              target='_blank'
              rel='noreferrer'
              className='inline-block mt-8 bg-white text-black px-8 py-4 text-sm tracking-[3px] font-semibold hover:bg-[#D4AF37] transition-all duration-300'
            >
              OPEN INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      <section className='mb-20 bg-black text-white rounded-[35px] p-10 md:p-16 text-center'>
        <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-5'>
          Scent Help
        </p>

        <h2 className='prata-regular text-4xl md:text-6xl'>
          Not sure what to choose?
        </h2>

        <p className='mt-5 text-gray-400 max-w-2xl mx-auto'>
          Take our fragrance quiz and let Cleo recommend a perfume that matches your mood.
        </p>

        <a
          href='/quiz'
          className='inline-block mt-8 bg-white text-black px-10 py-4 text-sm tracking-[3px] font-semibold hover:bg-[#D4AF37] transition-all duration-300'
        >
          START QUIZ
        </a>
      </section>

      <LuxuryBrands />
    </div>
  )
}

export default Contact