import React from 'react'
import aboutus from '../assets/aboutus.png'
import LuxuryBrands from '../components/LuxuryBrands'
const assets = { aboutus }


const About = () => {
  const values = [
    {
      icon: '🖤',
      title: 'Luxury Identity',
      text: 'Every Cleo fragrance is selected to feel elegant, bold, and unforgettable.'
    },
    {
      icon: '🎁',
      title: 'Reward Experience',
      text: 'Collect perfumes, unlock gifts, and make every order feel more personal.'
    },
    {
      icon: '⚡',
      title: 'Smooth Shopping',
      text: 'From discovery to checkout, we keep your fragrance journey simple and premium.'
    }
  ]

  return (
    <div className='border-t'>

      {/* HERO */}
      <section className='relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-black text-white rounded-b-[40px]'>
        <img
          src={assets.aboutus}
          alt='Cleo Perfumes'
          className='absolute inset-0 w-full h-full object-cover opacity-45'
        />

        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black'></div>

        <div className='relative z-10 text-center px-4 max-w-4xl'>
          <p className='text-xs md:text-sm tracking-[6px] uppercase text-[#D4AF37] mb-5'>
            Cleo Perfumes
          </p>

          <h1 className='prata-regular text-5xl md:text-7xl lg:text-8xl leading-tight'>
            Not Just Perfume.
            <br />
            A Signature.
          </h1>

          <p className='mt-7 text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-7'>
            Cleo was created for people who do not want to smell ordinary.
            We craft scent experiences that speak before you do.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className='py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
        <div>
          <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-4'>
            Our Story
          </p>

          <h2 className='prata-regular text-4xl md:text-6xl leading-tight text-black dark:text-white'>
            Born from elegance,
            <br />
            made for memory.
          </h2>
        </div>

        <div className='text-gray-600 dark:text-gray-300 leading-8 text-sm md:text-base space-y-6'>
          <p>
            Cleo Perfumes was born from a passion for luxury fragrances and a desire
            to create unforgettable experiences through scent.
          </p>

          <p>
            Every bottle is chosen to reflect confidence, individuality, and the
            silent power of a signature fragrance. We believe perfume is not only
            something you wear — it is something people remember you by.
          </p>

          <p className='font-semibold text-black dark:text-white'>
            Our mission is simple: make every customer feel unique, confident,
            and impossible to forget.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className='my-10 bg-[#faf8f3] dark:bg-[#0b0b0b] rounded-[35px] p-8 md:p-14'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <div>
            <h3 className='text-4xl md:text-5xl prata-regular text-[#D4AF37]'>
              01
            </h3>
            <p className='mt-4 font-semibold'>Discover</p>
            <p className='mt-3 text-sm text-gray-500'>
              Find the scent that fits your mood, style, and personality.
            </p>
          </div>

          <div>
            <h3 className='text-4xl md:text-5xl prata-regular text-[#D4AF37]'>
              02
            </h3>
            <p className='mt-4 font-semibold'>Wear</p>
            <p className='mt-3 text-sm text-gray-500'>
              Let your fragrance become part of your presence.
            </p>
          </div>

          <div>
            <h3 className='text-4xl md:text-5xl prata-regular text-[#D4AF37]'>
              03
            </h3>
            <p className='mt-4 font-semibold'>Be Remembered</p>
            <p className='mt-3 text-sm text-gray-500'>
              Leave behind a memory that feels elegant and personal.
            </p>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className='py-20 text-center max-w-5xl mx-auto'>
        <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-5'>
          Cleo Philosophy
        </p>

        <h2 className='prata-regular text-4xl md:text-6xl leading-tight'>
          “A fragrance is the invisible detail that completes your story.”
        </h2>
      </section>

      {/* WHY CHOOSE US */}
      <section className='mb-20'>
        <div className='text-center mb-10'>
          <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-3'>
            Why Choose Us
          </p>

          <h2 className='prata-regular text-4xl md:text-5xl'>
            The Cleo Experience
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {values.map((item, index) => (
            <div
              key={index}
              className='group border border-gray-200 dark:border-gray-800 rounded-3xl p-8 bg-white dark:bg-[#080808] hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] transition-all duration-300'
            >
              <div className='text-4xl mb-6'>{item.icon}</div>

              <h3 className='text-xl font-semibold mb-4'>
                {item.title}
              </h3>

              <p className='text-sm text-gray-500 dark:text-gray-400 leading-7'>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='mb-20 bg-black text-white rounded-[35px] p-10 md:p-16 text-center'>
        <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-5'>
          Find Your Scent
        </p>

        <h2 className='prata-regular text-4xl md:text-6xl'>
          Ready to meet your signature?
        </h2>

        <p className='mt-5 text-gray-400 max-w-2xl mx-auto'>
          Take the Cleo quiz and discover the fragrance that matches your energy.
        </p>

        <a
          href='/quiz'
   className='inline-flex rounded-full border border-white bg-black px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-black dark:border-[#D4AF37] dark:bg-transparent dark:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black'
        >
          START QUIZ
        </a>
      </section>

      <LuxuryBrands />
    </div>
  )
}

export default About