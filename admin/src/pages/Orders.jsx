/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import * as XLSX from 'xlsx'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null

    try {
      const response = await axios.post(
        backendUrl + '/order/list',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const downloadExcel = () => {
    if (orders.length === 0) {
      toast.error('No orders to export')
      return
    }

    const excelData = []

    orders.forEach((order) => {
      order.items.forEach((item) => {
        excelData.push({
          'Customer Name': `${order.address.firstName} ${order.address.lastName}`,
          Phone: order.address.phone,
          'Nearest Place': order.address.nearestPlace,
          City: order.address.city,
          State: order.address.state,
          Product: item.name,
          Size: item.size,
          Quantity: item.quantity,
          Price: item.price,
          'Order Amount': order.amount,
          'Payment Method': order.paymentMethod,
          Payment: order.payment ? 'Done' : 'Pending',
          Status: order.status,
          Date: new Date(order.date).toLocaleDateString()
        })
      })
    })

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    XLSX.writeFile(workbook, 'orders.xlsx')
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/order/status',
        {
          orderId,
          status: event.target.value
        },
        { headers: { token } }
      )

      if (response.data.success) {
        await fetchAllOrders()
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteHandler = async (orderId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order?'
    )

    if (!confirmDelete) return

    try {
      const response = await axios.post(
        backendUrl + '/order/delete',
        { orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h3>Order Page</h3>

        <button
          onClick={downloadExcel}
          className='bg-green-600 text-white px-5 py-2 rounded font-semibold'
        >
          Download Excel
        </button>
      </div>

      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
          >
            <img className='w-12' src={assets.parcel_icon} alt='' />

            <div>
              <div>
                {order.items.map((item, index) => (
                  <p className='py-0.5' key={index}>
                    {item.name} x {item.quantity}{' '}
                    <span>{item.size}</span>
                    {index !== order.items.length - 1 ? ',' : ''}
                  </p>
                ))}
              </div>

              <p className='mt-3 mb-2 font-medium'>
                {order.address.firstName} {order.address.lastName}
              </p>

              <div>
                <p>{order.address.nearestPlace}</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
              </div>

              <p>{order.address.phone}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>
                Items : {order.items.length}
              </p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px]'>
              {currency}
              {order.amount}
            </p>

            <div className='flex flex-col gap-2'>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className='p-2 font-semibold'
              >
                <option value='Order Placed'>Order Placed</option>
                <option value='Packing'>Packing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Out for delivery'>Out for delivery</option>
                <option value='Delivered'>Delivered</option>
              </select>

              <button
                onClick={() => deleteHandler(order._id)}
                className='bg-red-500 text-white px-4 py-2 rounded font-semibold'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders