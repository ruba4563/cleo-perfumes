import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const GiftSupport = ({ products = [] }) => {
  const currency = 'JOD '
  const instagramLink = 'https://www.instagram.com/cleoperfumes1/'

  const questions = [
    {
      key: 'category',
      title: 'Who is the gift for?',
      subtitle: 'Choose the perfume category.',
      options: [
        { value: 'Men', label: 'For Him', icon: '🖤' },
        { value: 'Women', label: 'For Her', icon: '👑' },
      ],
    },
    {
      key: 'subCategory',
      title: 'What type of fragrance do they like?',
      subtitle: 'Choose the closest fragrance note.',
      options: [
        { value: 'Fresh', label: 'Fresh', icon: '🍋' },
        { value: 'Woody', label: 'Woody', icon: '🪵' },
        { value: 'Sweet', label: 'Sweet', icon: '🍦' },
        { value: 'Amber', label: 'Amber', icon: '🔥' },
        { value: 'Musk', label: 'Musk', icon: '✨' },
        { value: 'Oud', label: 'Oud', icon: '🖤' },
      ],
    },
    {
      key: 'occasion',
      title: 'What is the occasion?',
      subtitle: 'This helps us choose the right feeling.',
      options: [
        { value: 'birthday', label: 'Birthday', icon: '🎂' },
        { value: 'romantic', label: 'Romantic Gift', icon: '💌' },
        { value: 'graduation', label: 'Graduation', icon: '🎓' },
        { value: 'daily', label: 'Just Because', icon: '🎁' },
      ],
    },
    {
      key: 'budget',
      title: 'What budget feels right?',
      subtitle: 'We’ll recommend something realistic.',
      options: [
        { value: 'low', label: 'Affordable', icon: '🤍' },
        { value: 'mid', label: 'Mid Range', icon: '✨' },
        { value: 'high', label: 'Luxury Pick', icon: '👑' },
      ],
    },
  ]

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  const normalizeNotes = (notes) => {
    if (!notes) return []

    if (Array.isArray(notes)) return notes

    if (typeof notes === 'string') {
      try {
        const parsed = JSON.parse(notes)
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        return [notes]
      }
    }

    return []
  }

  const collectionProducts = useMemo(() => {
    return products.filter(
      (item) =>
        !item.isGiftEligible &&
        item.category?.trim().toLowerCase() !== 'atomisers' &&
        Number(item.stock) > 0
    )
  }, [products])

  const recommendations = useMemo(() => {
    if (!showResult || collectionProducts.length === 0) return []

    const prices = collectionProducts.map((item) =>
      Number(item.offerPrice) > 0 ? Number(item.offerPrice) : Number(item.price)
    )

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const budgetScore = (price) => {
      if (maxPrice === minPrice) return 1

      const range = maxPrice - minPrice
      const lowLimit = minPrice + range * 0.33
      const midLimit = minPrice + range * 0.66

      if (answers.budget === 'low' && price <= lowLimit) return 3
      if (answers.budget === 'mid' && price > lowLimit && price <= midLimit)
        return 3
      if (answers.budget === 'high' && price > midLimit) return 3

      return 0
    }

    return collectionProducts
      .map((product) => {
        const price =
          Number(product.offerPrice) > 0
            ? Number(product.offerPrice)
            : Number(product.price)

        let score = 0

        if (
          product.category?.toLowerCase().trim() ===
          answers.category?.toLowerCase().trim()
        ) {
          score += 6
        }

        const notes = normalizeNotes(product.subCategory)
        const lowerNotes = notes.map((note) => note.toLowerCase().trim())

        if (
          lowerNotes.includes(answers.subCategory?.toLowerCase().trim())
        ) {
          score += 8
        }

        if (product.bestseller) score += 2

        score += budgetScore(price)

        if (
          answers.occasion === 'romantic' &&
          lowerNotes.some((note) =>
            ['sweet', 'oriental', 'amber', 'vanilla', 'musk'].includes(note)
          )
        ) {
          score += 3
        }

        if (
          answers.occasion === 'daily' &&
          lowerNotes.some((note) =>
            ['fresh', 'citrus', 'aquatic', 'green'].includes(note)
          )
        ) {
          score += 3
        }

        if (
          answers.occasion === 'graduation' &&
          lowerNotes.some((note) =>
            ['woody', 'fresh', 'amber', 'musk', 'oud'].includes(note)
          )
        ) {
          score += 3
        }

        if (answers.occasion === 'birthday') {
          score += 1
        }

        return { ...product, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [answers, collectionProducts, showResult])

  const chooseAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (!answers[currentQuestion.key]) return

    if (step === questions.length - 1) {
      setShowResult(true)
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (showResult) {
      setShowResult(false)
      return
    }

    if (step > 0) setStep((prev) => prev - 1)
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
    setShowResult(false)
  }

  return (
    <div className='border-t min-h-screen px-6 md:px-16 py-16 bg-white dark:bg-black'>
      <div className='max-w-6xl mx-auto'>
        <section className='relative overflow-hidden rounded-[40px] bg-black text-white p-8 md:p-14 mb-10'>
          <div className='absolute -top-24 -right-24 w-72 h-72 bg-[#D4AF37]/20 blur-3xl rounded-full' />
          <div className='absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 blur-3xl rounded-full' />

          <div className='relative z-10'>
            <p className='text-xs tracking-[6px] uppercase text-[#D4AF37] mb-5'>
              Cleo Gift Finder
            </p>

            <h1 className='prata-regular text-5xl md:text-7xl leading-tight'>
              Find the Perfect
              <br />
              Perfume Gift.
            </h1>

            <p className='mt-6 text-gray-300 max-w-2xl leading-7'>
              Answer a few questions and we’ll recommend real perfumes from our
              collection.
            </p>
          </div>
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch'>
          <div className='rounded-[35px] border border-gray-200 dark:border-gray-800 bg-[#faf8f3] dark:bg-[#080808] p-8 md:p-10'>
            {!showResult ? (
              <>
                <div className='mb-8'>
                  <div className='flex items-center justify-between mb-3'>
                    <p className='text-xs tracking-[4px] uppercase text-[#D4AF37]'>
                      Step {step + 1} of {questions.length}
                    </p>

                    <p className='text-xs text-gray-500'>
                      {Math.round(progress)}%
                    </p>
                  </div>

                  <div className='h-2 bg-white dark:bg-black rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-[#D4AF37] transition-all duration-500'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <h2 className='prata-regular text-4xl md:text-5xl mb-3'>
                  {currentQuestion.title}
                </h2>

                <p className='text-gray-500 dark:text-gray-400 mb-8'>
                  {currentQuestion.subtitle}
                </p>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {currentQuestion.options.map((option) => {
                    const selected =
                      answers[currentQuestion.key] === option.value

                    return (
                      <button
                        key={option.value}
                        type='button'
                        onClick={() =>
                          chooseAnswer(currentQuestion.key, option.value)
                        }
                        className={`text-left rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                          selected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_20px_50px_rgba(212,175,55,0.18)]'
                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black'
                        }`}
                      >
                        <div className='text-4xl mb-5'>{option.icon}</div>
                        <p className='font-semibold text-lg'>
                          {option.label}
                        </p>
                      </button>
                    )
                  })}
                </div>

                <div className='flex items-center justify-between mt-10'>
                  <button
                    type='button'
                    onClick={prevStep}
                    disabled={step === 0}
                    className='text-sm tracking-[3px] font-semibold disabled:opacity-30'
                  >
                    BACK
                  </button>

                  <button
                    type='button'
                    onClick={nextStep}
                    className='bg-black text-white dark:bg-white dark:text-black px-8 py-4 text-sm tracking-[3px] font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300'
                  >
                    {step === questions.length - 1 ? 'REVEAL GIFTS' : 'NEXT'}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-5'>
                  Your Gift Matches
                </p>

                <h2 className='prata-regular text-4xl md:text-5xl mb-8'>
                  We found these perfumes for you.
                </h2>

                {recommendations.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {recommendations.map((item, index) => (
                      <div
                        key={item._id}
                        className='bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-[28px] p-5'
                      >
                        <div className='text-xs tracking-[4px] text-[#D4AF37] mb-3'>
                          MATCH #{index + 1}
                        </div>

                        <div className='bg-gray-100 dark:bg-zinc-900 rounded-3xl p-4 mb-4'>
                          <img
                            src={
                              Array.isArray(item.image)
                                ? item.image[0]
                                : item.image
                            }
                            alt={item.name}
                            className='w-full h-52 object-contain'
                          />
                        </div>

                        <h3 className='font-semibold text-lg mb-2'>
                          {item.name}
                        </h3>

                        <p className='text-sm text-[#D4AF37] mb-3'>
                          {item.category} •{' '}
                          {normalizeNotes(item.subCategory).join(', ')}
                        </p>

                        <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4'>
                          {item.description}
                        </p>

                        <div className='flex items-center gap-2 mb-5'>
                          {Number(item.offerPrice) > 0 ? (
                            <>
                              <p className='font-semibold'>
                                {currency}
                                {item.offerPrice}
                              </p>
                              <p className='text-sm text-gray-400 line-through'>
                                {currency}
                                {item.price}
                              </p>
                            </>
                          ) : (
                            <p className='font-semibold'>
                              {currency}
                              {item.price}
                            </p>
                          )}
                        </div>

                        <Link
                          to={`/product/${item._id}`}
                          className='block text-center bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-xs tracking-[3px] font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300'
                        >
                          VIEW PERFUME
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500'>
                    No matching perfumes found in the collection.
                  </p>
                )}

                <div className='flex flex-wrap gap-4 mt-8'>
                  <a
                    href={instagramLink}
                    target='_blank'
                    rel='noreferrer'
                    className='bg-black text-white dark:bg-white dark:text-black px-8 py-4 text-sm tracking-[3px] font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300'
                  >
                    ASK ON INSTAGRAM
                  </a>

                  <button
                    type='button'
                    onClick={restart}
                    className='border border-black dark:border-white px-8 py-4 text-sm tracking-[3px] font-semibold'
                  >
                    TRY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className='rounded-[35px] bg-black text-white p-8 md:p-10 flex flex-col justify-between overflow-hidden relative'>
            <div className='absolute top-0 right-0 w-52 h-52 bg-[#D4AF37]/20 blur-3xl rounded-full' />

            <div className='relative z-10'>
              <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-5'>
                Collection Match
              </p>

              <h3 className='prata-regular text-4xl mb-6'>
                Real perfumes from your collection.
              </h3>

              <p className='text-gray-400 leading-8'>
                The result is selected from available products in the collection,
                not from Gift Eligible products.
              </p>
            </div>

            <div className='relative z-10 mt-10 grid grid-cols-2 gap-4'>
              <div className='rounded-3xl bg-white/10 p-5'>
                <p className='text-3xl mb-3'>🛍️</p>
                <p className='text-sm text-gray-300'>Collection products</p>
              </div>

              <div className='rounded-3xl bg-white/10 p-5'>
                <p className='text-3xl mb-3'>📦</p>
                <p className='text-sm text-gray-300'>In stock only</p>
              </div>

              <div className='rounded-3xl bg-white/10 p-5'>
                <p className='text-3xl mb-3'>✨</p>
                <p className='text-sm text-gray-300'>Smart matching</p>
              </div>

              <div className='rounded-3xl bg-white/10 p-5'>
                <p className='text-3xl mb-3'>🎁</p>
                <p className='text-sm text-gray-300'>Gift suggestion</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GiftSupport