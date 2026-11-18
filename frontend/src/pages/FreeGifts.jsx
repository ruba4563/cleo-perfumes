import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const FreeGifts = ({ products = [], darkMode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const currency = 'JOD '
  const navigate = useNavigate()
  const { getToken, isLoaded, isSignedIn, userId } = useAuth()

  const [giftCredits, setGiftCredits] = useState(0)

  const giftProducts = products.filter(
    (product) => product.isGiftEligible && product.stock > 0
  )

  const loadProfile = async () => {
    try {
      const clerkToken = await getToken()

      const response = await axios.post(
        backendUrl + '/user/profile',
        {},
        {
          headers: {
            Authorization: `Bearer ${clerkToken}`
          }
        }
      )

      if (response.data.success) {
        setGiftCredits(response.data.user.freeGiftCredits || 0)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const claimGift = async (productId) => {
    try {if (!window.confirm(
  'Send this gift to the delivery address from your most recent regular order?',
)) return
      if (giftCredits < 1) {
        toast.error('You do not have any free gifts')
        return
      }

      const clerkToken = await getToken()

      const response = await axios.post(
        backendUrl + '/order/claim-gift',
        { productId },
        {
          headers: {
            Authorization: `Bearer ${clerkToken}`
          }
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/orders')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
     toast.error(
  error.response?.data?.message || 'Unable to confirm the gift claim. Check My Orders before trying again.',
)
    }
  }

 useEffect(() => {
  setGiftCredits(0)

  if (isLoaded && isSignedIn) {
    loadProfile()
  }
}, [isLoaded, isSignedIn, userId])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1='FREE' text2='GIFTS' />
      </div>

      <p className={darkMode ? 'text-gray-300 mb-6' : 'text-gray-600 mb-6'}>
        You have {giftCredits} free gift credit(s).
      </p>

      {giftCredits < 1 ? (
        <div className='text-center py-20'>
          <p className='text-lg mb-4'>You do not have any free gifts yet.</p>
          <button
            onClick={() => navigate('/collection')}
            className='bg-black text-white px-8 py-3'
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : giftProducts.length === 0 ? (
        <p>No gift products available right now.</p>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {giftProducts.map((product) => (
            <div
              key={product._id}
              className={
                darkMode
                  ? 'border border-[#2a2a2a] bg-[#0b0b0b] p-4'
                  : 'border border-gray-200 bg-white p-4'
              }
            >
              <img
                src={product.image?.[0]}
                alt={product.name}
                className='w-full h-64 object-cover mb-4'
              />

              <h3 className='font-semibold'>{product.name}</h3>

              <p className='text-sm text-gray-500 line-through mt-1'>
                {currency}{product.price}
              </p>

              <p className='font-semibold mt-1'>FREE</p>

              <button
                onClick={() => claimGift(product._id)}
                className='mt-4 w-full bg-black text-white py-3 text-sm font-semibold'
              >
                CLAIM GIFT
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FreeGifts