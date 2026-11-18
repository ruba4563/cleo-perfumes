import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState([])
  const [bestseller, setBestseller] = useState(false)
  const [isGiftEligible, setIsGiftEligible] = useState(false)
  const [sizes, setSizes] = useState([])

  const fragranceTypes = [
    'Oud',
    'Musk',
    'Amber',
    'Woody',
    'Fresh',
    'Citrus',
    'Floral',
    'Sweet',
    'Vanilla',
    'Oriental',
    'Spicy',
    'Leather',
    'Fruity',
    'Powdery',
    'Aquatic',
    'Green',
    'Smoky',
  ]

  const toggleSubCategory = (type) => {
    setSubCategory((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    )
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (subCategory.length === 0) {
      toast.error('Please select at least one fragrance note')
      return
    }

    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)
      formData.append('category', category)
      formData.append('subCategory', JSON.stringify(subCategory))
      formData.append('bestseller', bestseller)
      formData.append('isGiftEligible', isGiftEligible)
      formData.append('sizes', JSON.stringify(sizes))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(
        backendUrl + '/product/add',
        formData,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)

        setName('')
        setDescription('')
        setPrice('')
        setStock('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSizes([])
        setBestseller(false)
        setIsGiftEligible(false)
        setCategory('Men')
        setSubCategory([])
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
     toast.error(
  error.response?.data?.message || error.message || 'Could not add product',
)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Product Images</p>

        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className='w-20 cursor-pointer'
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt=''
              />

              <input
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (index === 0) setImage1(file)
                  if (index === 1) setImage2(file)
                  if (index === 2) setImage3(file)
                  if (index === 3) setImage4(file)
                }}
                type='file'
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full max-w-[500px] px-3 py-2 border'
          type='text'
          placeholder='Example: Cleo Amber Night'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='w-full max-w-[500px] px-3 py-2 border'
          placeholder='Write product details here'
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className='w-full px-3 py-2 border'
          >
            <option value='Men'>Men</option>
<option value='Women'>Women</option>
<option value='Unisex'>Unisex</option>
<option value='Cleo Exclusive'>Cleo Exclusive</option>
<option value='Atomisers'>Atomisers</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full px-3 py-2 sm:w-[120px] border'
            type='number'
            placeholder='85'
            required
          />
        </div>

        <div>
          <p className='mb-2'>Stock Quantity</p>
          <input
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            className='w-full px-3 py-2 sm:w-[120px] border'
            type='number'
            placeholder='20'
            required
          />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Fragrance Notes</p>

        <div className='flex flex-wrap gap-2 max-w-[650px]'>
          {fragranceTypes.map((type) => (
            <div key={type} onClick={() => toggleSubCategory(type)}>
              <p
                className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                  subCategory.includes(type)
                    ? 'bg-black text-white'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
              >
                {type}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Size</p>

        <div className='flex gap-3 flex-wrap'>
          {['5ml', '10ml', '50ml', '60ml', '75ml', '100ml', '120ml'].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size)
                    ? 'bg-black text-white'
                    : 'bg-slate-200'
                } px-4 py-2 cursor-pointer rounded`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type='checkbox'
          id='bestseller'
        />

        <label className='cursor-pointer' htmlFor='bestseller'>
          Add to bestseller
        </label>
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => setIsGiftEligible((prev) => !prev)}
          checked={isGiftEligible}
          type='checkbox'
          id='isGiftEligible'
        />

        <label className='cursor-pointer' htmlFor='isGiftEligible'>
          Gift eligible product
        </label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>
        ADD
      </button>
    </form>
  )
}

export default Add