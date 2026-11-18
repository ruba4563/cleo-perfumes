import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Marketing = ({ token }) => {
  const [announcementEnabled, setAnnouncementEnabled] = useState(true)
  const [messages, setMessages] = useState(['', '', ''])

  const [discountEnabled, setDiscountEnabled] = useState(true)
  const [discounts, setDiscounts] = useState([])
  const [activeDiscountId, setActiveDiscountId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadSettings = async () => {
    try {
    const response = await axios.get(`${backendUrl}/settings`)

    if (response.data.success) {
      const settings = response.data.settings

      setAnnouncementEnabled(settings.announcementEnabled)

      setMessages([
        settings.announcementMessages?.[0] || '',
        settings.announcementMessages?.[1] || '',
        settings.announcementMessages?.[2] || '',
      ])

      setDiscountEnabled(settings.discountEnabled ?? true)
      setDiscounts(settings.discounts || [])
      setActiveDiscountId(settings.activeDiscountId || '')
    } else {
      throw new Error(response.data.message || 'Unable to load settings')
    }
    setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const addDiscountCode = () => {
    setDiscounts([...discounts, {
      id: crypto.randomUUID(), name: '',
      tiers: [{ quantity: 2, price: 18 }, { quantity: 3, price: 25 },
        { quantity: 4, price: 32 }, { quantity: 5, price: 40 }, { quantity: 6, price: 50 }],
    }])
  }

  const removeDiscountCode = (id) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id))
    if (activeDiscountId === id) setActiveDiscountId('')
  }

  const updateDiscount = (id, patch) => {
    setDiscounts((current) => current.map((discount) =>
      discount.id === id ? { ...discount, ...patch } : discount))
  }

  const saveSettings = async () => {
    if (saving || loading) return
    setSaving(true)
    try {
    const response = await axios.post(
      `${backendUrl}/settings/update`,
      {
        announcementEnabled,
        announcementMessages: messages.filter((m) => m.trim() !== ''),
        discountEnabled,
        discounts: discounts.map((discount) => ({
          ...discount, name: discount.name.trim(),
          tiers: discount.tiers.map((tier) => ({
            quantity: tier.quantity === '' ? null : Number(tier.quantity),
            price: tier.price === '' ? null : Number(tier.price),
          })),
        })),
        activeDiscountId,
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
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setSaving(false)
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
          Enable Discounts
        </label>

        <div className='flex flex-col gap-3'>
          <label className='flex items-center gap-3'>
            <input type='radio' name='active-discount' checked={!activeDiscountId}
              onChange={() => setActiveDiscountId('')} />
            No active discount
          </label>
          {discounts.map((discount, index) => (
            <div key={discount.id} className='rounded border border-gray-300 p-4'>
              <div className='mb-4 flex items-center gap-3'>
                <label className='flex items-center gap-2'>
                  <input type='radio' name='active-discount'
                    checked={activeDiscountId === discount.id}
                    onChange={() => setActiveDiscountId(discount.id)} />
                  Active
                </label>
              <input
                className='w-full border border-gray-300 px-4 py-3'
                aria-label={`Discount ${index + 1} name`}
                placeholder={`Discount ${index + 1} name`}
                value={discount.name}
                onChange={(e) => updateDiscount(discount.id, { name: e.target.value })}
              />

              <button
                type='button'
                aria-label={`Remove discount ${index + 1}`}
                onClick={() => removeDiscountCode(discount.id)}
                className='bg-red-600 px-4 text-white'
              >
                X
              </button>
              </div>
              <div className='mb-2 grid grid-cols-[1fr_1fr_auto] gap-2 text-sm'>
                <span>Perfume quantity</span><span>Bundle price (JOD)</span><span />
              </div>
              {discount.tiers.map((tier, tierIndex) => (
                <div key={tierIndex} className='mb-2 grid grid-cols-[1fr_1fr_auto] gap-2'>
                  {['quantity', 'price'].map((field) => (
                    <input key={field} type='number' min={field === 'quantity' ? 1 : 0}
                      step={field === 'quantity' ? 1 : '0.001'} value={tier[field]}
                      aria-label={`${discount.name || 'Discount'} tier ${tierIndex + 1} ${field}`}
                      className='min-w-0 border border-gray-300 px-3 py-2'
                      onChange={(e) => updateDiscount(discount.id, {
                        tiers: discount.tiers.map((entry, i) => i === tierIndex
                          ? { ...entry, [field]: e.target.value } : entry),
                      })} />
                  ))}
                  <button type='button' className='bg-red-600 px-4 text-white'
                    aria-label={`Remove tier ${tierIndex + 1}`}
                    onClick={() => updateDiscount(discount.id, {
                      tiers: discount.tiers.filter((_, i) => i !== tierIndex),
                    })}>X</button>
                </div>
              ))}
              <button type='button' className='mt-2 rounded border border-black px-4 py-2'
                onClick={() => updateDiscount(discount.id, {
                  tiers: [...discount.tiers, { quantity: '', price: '' }],
                })}>Add Price Tier</button>
              <p className='mt-3 text-sm'>Matching perfume quantities get this bundle price and free delivery.</p>
            </div>
          ))}
        </div>

        <button
          type='button'
          onClick={addDiscountCode}
          className='mt-4 rounded border border-black px-5 py-2'
        >
          Add Discount
        </button>
      </div>

      <button
        onClick={saveSettings}
        disabled={loading || saving}
        className='mt-6 rounded bg-black px-6 py-3 text-white'
      >
        {saving ? 'Saving...' : loading ? 'Loading...' : 'Save Settings'}
      </button>
    </div>
  )
}

export default Marketing
