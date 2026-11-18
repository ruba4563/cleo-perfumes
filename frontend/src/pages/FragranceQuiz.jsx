import React, { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'

const FragranceQuiz = ({ products = [], darkMode }) => {

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    gender: '',
    mood: '',
    time: '',
  })

  const questions = [
    {
      key: 'gender',
      title: 'Who is this scent for?',
      subtitle: 'Choose the identity that fits your fragrance journey.',
      options: [
        { value: 'Men', label: 'Men', icon: '👔' },
        { value: 'Women', label: 'Women', icon: '🌸' },
        { value: 'Unisex', label: 'Unisex', icon: '✨' },
      ],
    },
    {
      key: 'mood',
      title: 'What mood are you chasing?',
      subtitle: 'Every scent tells a story. Pick your vibe.',
      options: [
        { value: 'fresh', label: 'Fresh & Clean', icon: '🍋', type: 'Fresh' },
        { value: 'sweet', label: 'Sweet & Romantic', icon: '🍦', type: 'Sweet' },
        { value: 'oud', label: 'Oud & Powerful', icon: '🖤', type: 'Oud' },
        { value: 'woody', label: 'Warm & Woody', icon: '🪵', type: 'Woody' },
        { value: 'amber', label: 'Amber & Elegant', icon: '🔥', type: 'Amber' },
        { value: 'musk', label: 'Soft & Musky', icon: '✨', type: 'Musk' },
      ],
    },
    {
      key: 'time',
      title: 'When will you wear it?',
      subtitle: 'Let the moment decide your signature.',
      options: [
        { value: 'Day', label: 'Day', icon: '☀️' },
        { value: 'Night', label: 'Night', icon: '🌙' },
        { value: 'Anytime', label: 'Anytime', icon: '⏳' },
      ],
    },
  ]

  const currentQuestion = questions[step]
  const isComplete = answers.gender && answers.mood && answers.time

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

  const selectedMood = questions[1].options.find(
    (option) => option.value === answers.mood
  )

  const resultType = selectedMood?.type || ''

  const scentIdentity =
    resultType === 'Fresh'
      ? 'The Clean Aura'
      : resultType === 'Sweet'
      ? 'The Romantic Soul'
      : resultType === 'Oud'
      ? 'The Powerful Signature'
      : resultType === 'Woody'
      ? 'The Warm Signature'
      : resultType === 'Amber'
      ? 'The Golden Elegance'
      : resultType === 'Musk'
      ? 'The Soft Aura'
      : 'Your Signature Scent'

  const results = products
    .filter(
      (item) =>
        !item.isGiftEligible &&
        item.category?.trim().toLowerCase() !== 'atomisers' &&
        Number(item.stock) > 0
    )
    .filter((item) => {
      const genderMatch =
        !answers.gender ||
        item.category === answers.gender ||
        item.category === 'Unisex'

      const notes = normalizeNotes(item.subCategory)

      const fragranceMatch = notes.some(
        (note) =>
          note.toLowerCase().trim() === resultType.toLowerCase().trim()
      )

      return genderMatch && fragranceMatch
    })

  const selectAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))

    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep((prev) => prev + 1)
      }
    }, 250)
  }

  const resetQuiz = () => {
    setStep(0)
    setAnswers({
      gender: '',
      mood: '',
      time: '',
    })
  }

  return (
    <div className='border-t pt-12 min-h-[70vh] text-gray-800 dark:text-gray-100'>
      <div className='text-center max-w-3xl mx-auto px-4'>
        <p className='text-xs tracking-[5px] uppercase text-[#D4AF37] mb-3'>
          Cleo Scent Finder
        </p>

        <h1 className='text-4xl md:text-6xl prata-regular'>
          Find Your Signature Scent
        </h1>

        <p className='mt-4 text-gray-500 dark:text-gray-400'>
          A short fragrance ritual to discover the scent that matches your
          style.
        </p>
      </div>

      <div className='max-w-3xl mx-auto mt-10 px-4'>
        <div className='flex items-center gap-3 mb-8'>
          {questions.map((_, index) => (
            <div key={index} className='flex-1'>
              <div
                className={`h-[3px] rounded-full ${
                  index <= step
                    ? 'bg-[#D4AF37]'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            </div>
          ))}
        </div>

        {!isComplete ? (
          <div
            className={
              darkMode
                ? 'border border-[#2a2a2a] bg-[#0b0b0b] rounded-2xl p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
                : 'border border-gray-200 bg-white rounded-2xl p-7 md:p-10 shadow-sm'
            }
          >
            <div className='flex items-center justify-between mb-8'>
              <div>
                <p className='text-xs tracking-[3px] uppercase text-gray-400 mb-2'>
                  Step {step + 1} of {questions.length}
                </p>

                <h2 className='text-2xl md:text-3xl font-semibold'>
                  {currentQuestion.title}
                </h2>

                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                  {currentQuestion.subtitle}
                </p>
              </div>
            </div>

            <div className='grid gap-4'>
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() =>
                    selectAnswer(currentQuestion.key, option.value)
                  }
                  className={`group flex items-center justify-between border px-5 py-4 rounded-xl transition-all duration-300 ${
                    answers[currentQuestion.key] === option.value
                      ? 'bg-black text-white border-black dark:bg-[#D4AF37] dark:text-black dark:border-[#D4AF37]'
                      : 'border-gray-300 hover:border-black hover:translate-x-1 dark:border-gray-700 dark:hover:border-[#D4AF37]'
                  }`}
                >
                  <span className='flex items-center gap-4'>
                    <span className='text-2xl'>{option.icon}</span>
                    <span className='font-medium'>{option.label}</span>
                  </span>

                  <span className='text-lg opacity-50 group-hover:opacity-100'>
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className='flex justify-between mt-8'>
              <button
                type='button'
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                disabled={step === 0}
                className={`px-5 py-3 text-sm border rounded ${
                  step === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black'
                }`}
              >
                Back
              </button>

              <button
                type='button'
                onClick={resetQuiz}
                className='px-5 py-3 text-sm text-gray-500 hover:text-black dark:hover:text-white'
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div className='mt-10'>
            <div
              className={
                darkMode
                  ? 'border border-[#2a2a2a] bg-[#0b0b0b] rounded-2xl p-8 text-center'
                  : 'border border-gray-200 bg-[#faf8f3] rounded-2xl p-8 text-center'
              }
            >
              <p className='text-xs tracking-[4px] uppercase text-[#D4AF37] mb-3'>
                Your Scent Identity
              </p>

              <h2 className='text-3xl md:text-5xl prata-regular'>
                {scentIdentity}
              </h2>

              <p className='mt-4 text-gray-500 dark:text-gray-400'>
                We matched you with {resultType} fragrances for{' '}
                {answers.time.toLowerCase()} wear.
              </p>

              <button
                type='button'
                onClick={resetQuiz}
                className='mt-6 border border-black dark:border-[#D4AF37] px-6 py-3 text-sm font-semibold hover:bg-black hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all duration-300'
              >
                RETAKE QUIZ
              </button>
            </div>

            <h3 className='text-2xl mt-12 mb-6'>Recommended For You</h3>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
              {results.length > 0 ? (
                results.slice(0, 8).map((item) => (
                 <ProductCard key={item._id} product={item} />
                ))
              ) : (
                <p className='text-gray-500'>No matching perfumes found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FragranceQuiz