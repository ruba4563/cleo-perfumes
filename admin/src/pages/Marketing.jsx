import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Marketing = ({ token }) => {
  const [announcementEnabled, setAnnouncementEnabled] = useState(true)
  const [messages, setMessages] = useState(['', '', ''])

  const [discountEnabled, setDiscountEnabled] = useState(true)
  const [discountCodes, setDiscountCodes] = useState(['CLEO20'])

  const loadSettings = async () => {
    const response = await axios.get(`${backendUrl}/api/settings`)

    if (response.data.success) {
      const settings = response.data.settings

      setAnnouncementEnabled(settings.announcementEnabled)

      setMessages([
        settings.announcementMessages?.[0] || '',
        settings.announcementMessages?.[1] || '',
        settings.announcementMessages?.[2] || '',
      ])

      setDiscountEnabled(settings.discountEnabled ?? true)
      setDiscountCodes(
        settings.discountCodes?.length
          ? settings.discountCodes
          : settings.discountCode
            ? [settings.discountCode]
            : ['CLEO20']
      )
    }
  }

  const addDiscountCode = () => {
    setDiscountCodes([...discountCodes, ''])
  }

  const removeDiscountCode = (index) => {
    setDiscountCodes(discountCodes.filter((_, i) => i !== index))
  }

  const saveSettings = async () => {
    const response = await axios.post(
      `${backendUrl}/api/settings/update`,
      {
        announcementEnabled,
        announcementMessages: messages.filter((m) => m.trim() !== ''),
        discountEnabled,
        discountCodes: discountCodes.filter((code) => code.trim() !== ''),
      },
      {
        headers: { token },
      }
    )

    if (response.data.success) {
      toast.success('Settings saved')
    } else {
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <div>
      <h2 className='mb-6 text-2xl font-semibold'>Marketing Settings</h2>

      <label className='mb-6 flex items-center gap-3'>
        <input
          type='checkbox'
          checked={announcementEnabled}
          onChange={() => setAnnouncementEnabled(!announcementEnabled)}
        />
        Enable Announcement Bar
      </label>

      <div className='flex flex-col gap-4'>
        {messages.map((message, index) => (
          <input
            key={index}
            className='w-full border border-gray-300 px-4 py-3'
            placeholder={`Message ${index + 1}`}
            value={message}
            onChange={(e) => {
              const updated = [...messages]
              updated[index] = e.target.value
              setMessages(updated)
            }}
          />
        ))}
      </div>

      <div className='mt-8 border-t pt-6'>
        <h3 className='mb-4 text-xl font-semibold'>Discount Settings</h3>

        <label className='mb-4 flex items-center gap-3'>
          <input
            type='checkbox'
            checked={discountEnabled}
            onChange={() => setDiscountEnabled(!discountEnabled)}
          />
          Enable Discount Codes
        </label>

        <div className='flex flex-col gap-3'>
          {discountCodes.map((code, index) => (
            <div key={index} className='flex gap-2'>
              <input
                className='w-full border border-gray-300 px-4 py-3'
                placeholder={`Discount Code ${index + 1}`}
                value={code}
                onChange={(e) => {
                  const updated = [...discountCodes]
                  updated[index] = e.target.value.toUpperCase()
                  setDiscountCodes(updated)
                }}
              />

              <button
                type='button'
                onClick={() => removeDiscountCode(index)}
                className='bg-red-600 px-4 text-white'
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type='button'
          onClick={addDiscountCode}
          className='mt-4 rounded border border-black px-5 py-2'
        >
          Add Discount Code
        </button>
      </div>

      <button
        onClick={saveSettings}
        className='mt-6 rounded bg-black px-6 py-3 text-white'
      >
        Save Settings
      </button>
    </div>
  )
}

export default Marketing