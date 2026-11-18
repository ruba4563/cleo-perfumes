/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth, useUser, useClerk } from '@clerk/clerk-react'
import Title from '../components/Title'

const Profile = ({ darkMode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [orders, setOrders] = useState([])
  const [profile, setProfile] = useState(null)

  const loadOrders = async () => {
    try {
      const clerkToken = await getToken()

      const response = await axios.post(
        backendUrl + '/order/userorders',
        {},
        {
          headers: {
            Authorization: `Bearer ${clerkToken}`
          }
        }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (error) {
      console.log(error)
    }
  }

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
        setProfile(response.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      loadOrders()
      loadProfile()
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className='border-t pt-16'>
        <p>Please login first.</p>
      </div>
    )
  }

  const rewardPoints = profile?.rewardPoints || 0
  const freeGiftCredits = profile?.freeGiftCredits || 0
  const progress = (rewardPoints / 9) * 100

  const cardClass = darkMode
    ? 'border border-[#2a2a2a] bg-[#0b0b0b] rounded-xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
    : 'border border-gray-200 bg-white rounded-xl p-5 shadow-sm'

  const labelClass = darkMode
    ? 'text-sm text-gray-300'
    : 'text-sm text-gray-500'

  const valueClass = darkMode
    ? 'font-semibold mt-2 text-white'
    : 'font-semibold mt-2 text-black'

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1='MY' text2='PROFILE' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div
          className={
            darkMode
              ? 'lg:col-span-1 border border-[#2a2a2a] bg-[#0b0b0b] rounded-xl p-6 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
              : 'lg:col-span-1 border border-gray-200 bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm'
          }
        >
          <img
            src={user?.imageUrl}
            alt='profile'
            className={
              darkMode
                ? 'w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#D4AF37]'
                : 'w-24 h-24 rounded-full object-cover mb-4 border border-gray-200'
            }
          />

          <h2 className={darkMode ? 'text-xl font-semibold text-white' : 'text-xl font-semibold text-black'}>
            {user?.fullName || 'User'}
          </h2>

          <p className={darkMode ? 'text-gray-300 text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>
            {user?.primaryEmailAddress?.emailAddress || '-'}
          </p>

          <span
            className={
              darkMode
                ? 'mt-4 bg-[#D4AF37] text-black px-5 py-2 rounded-full text-sm font-semibold'
                : 'mt-4 bg-black text-white px-5 py-2 rounded-full text-sm font-semibold'
            }
          >
            Active Customer
          </span>
        </div>

        <div className='lg:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4'>
          <div className={cardClass}>
            <p className={labelClass}>📦 Total Orders</p>
            <h3 className={`${valueClass} text-3xl`}>{orders.length}</h3>
          </div>

          <div className={cardClass}>
            <p className={labelClass}>🏆 Points</p>
            <h3 className={`${valueClass} text-3xl`}>{rewardPoints}/9</h3>
          </div>

          <div
            onClick={() => freeGiftCredits > 0 && navigate('/free-gifts')}
            className={`${cardClass} ${
              freeGiftCredits > 0
                ? 'cursor-pointer hover:scale-[1.02] transition-all duration-300'
                : ''
            }`}
          >
            <p className={labelClass}>🎁 Free Gifts</p>
            <h3 className={`${valueClass} text-3xl`}>{freeGiftCredits}</h3>

            {freeGiftCredits > 0 && (
              <p className='text-xs mt-2 text-[#D4AF37]'>Click to claim</p>
            )}
          </div>

          <div className={cardClass}>
            <p className={labelClass}>💳 Payment</p>
            <h3 className={`${valueClass} text-lg`}>COD</h3>
          </div>

          <div
            className={
              darkMode
                ? 'sm:col-span-4 border border-[#2a2a2a] bg-[#0b0b0b] rounded-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
                : 'sm:col-span-4 border border-gray-200 bg-white rounded-xl p-6 shadow-sm'
            }
          >
            <div className='flex justify-between items-center mb-3'>
              <h3 className={darkMode ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-black'}>
                Reward Progress
              </h3>

              <p className={darkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>
                {9 - rewardPoints} perfumes until next gift
              </p>
            </div>

            <div className={darkMode ? 'w-full h-3 bg-[#222] rounded-full overflow-hidden' : 'w-full h-3 bg-gray-200 rounded-full overflow-hidden'}>
              <div
                className='h-full bg-[#D4AF37] rounded-full transition-all duration-500'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={
              darkMode
                ? 'sm:col-span-4 border border-[#2a2a2a] bg-[#0b0b0b] rounded-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
                : 'sm:col-span-4 border border-gray-200 bg-white rounded-xl p-6 shadow-sm'
            }
          >
            <h3 className={darkMode ? 'text-lg font-semibold mb-4 text-white' : 'text-lg font-semibold mb-4 text-black'}>
              Quick Actions
            </h3>

            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => navigate('/orders')}
                className={
                  darkMode
                    ? 'bg-[#D4AF37] text-black px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-transparent hover:text-[#D4AF37] border border-[#D4AF37] transition-all duration-300'
                    : 'bg-black text-white px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-gray-800 transition-all duration-300'
                }
              >
                VIEW ORDERS
              </button>

              <button
                onClick={() => navigate('/collection')}
                className={
                  darkMode
                    ? 'border border-[#D4AF37] text-[#D4AF37] px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-[#D4AF37] hover:text-black transition-all duration-300'
                    : 'border border-black text-black px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-black hover:text-white transition-all duration-300'
                }
              >
                CONTINUE SHOPPING
              </button>

              {freeGiftCredits > 0 && (
                <button
                  onClick={() => navigate('/free-gifts')}
                  className={
                    darkMode
                      ? 'border border-[#D4AF37] text-[#D4AF37] px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-[#D4AF37] hover:text-black transition-all duration-300'
                      : 'border border-[#D4AF37] text-black px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-[#D4AF37] transition-all duration-300'
                  }
                >
                  CLAIM FREE GIFT
                </button>
              )}

              <button
                onClick={() => signOut()}
                className={
                  darkMode
                    ? 'border border-red-500 text-red-400 px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-red-500 hover:text-white transition-all duration-300'
                    : 'border border-red-500 text-red-500 px-6 py-3 text-sm font-semibold tracking-[1px] hover:bg-red-500 hover:text-white transition-all duration-300'
                }
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile