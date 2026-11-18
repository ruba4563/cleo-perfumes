import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const COST_PER_PERFUME = 3.333

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/order/list',
        {},
        { headers: { token } }
      )

      if (response.data.success) setOrders(response.data.orders)
      else toast.error(response.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/product/list')

      if (response.data.success) setProducts(response.data.products)
      else toast.error(response.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
    fetchProducts()
  }, [token])

  const availableYears = useMemo(() => {
    const years = orders.map((order) => new Date(order.date).getFullYear())
    return [...new Set([now.getFullYear(), ...years])].sort((a, b) => b - a)
  }, [orders])

  const selectedMonthOrders = orders.filter((order) => {
    const orderDate = new Date(order.date)

    return (
      orderDate.getMonth() === Number(selectedMonth) &&
      orderDate.getFullYear() === Number(selectedYear)
    )
  })

  const getOrderItemsCount = (order) => {
    return order.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
  }

  const getProfitByQuantity = (quantity) => {
    let profit = 0
    let remaining = quantity

    while (remaining >= 3) {
      profit += 10
      remaining -= 3
    }

    if (remaining === 2) profit += 8
    if (remaining === 1) profit += 7

    return profit
  }

  const totalPerfumesInStock = products.reduce((sum, product) => {
    return sum + Number(product.stock || 0)
  }, 0)

  const totalInventoryValue = totalPerfumesInStock * COST_PER_PERFUME

  const monthRevenue = selectedMonthOrders.reduce((sum, order) => {
    return sum + Number(order.amount || 0)
  }, 0)

  const monthProfit = selectedMonthOrders.reduce((sum, order) => {
    return sum + getProfitByQuantity(getOrderItemsCount(order))
  }, 0)

  const customers = new Set(
    selectedMonthOrders.map((order) => order.address?.phone).filter(Boolean)
  )

  const productSales = {}

  selectedMonthOrders.forEach((order) => {
    order.items.forEach((item) => {
      const quantity = Number(item.quantity) || 1
      productSales[item.name] = (productSales[item.name] || 0) + quantity
    })
  })

  const bestProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const dailyOrders = {}

  selectedMonthOrders.forEach((order) => {
    const date = new Date(order.date).toLocaleDateString()
    dailyOrders[date] = (dailyOrders[date] || 0) + 1
  })

  const dailyOrdersArray = Object.entries(dailyOrders).reverse()

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h2 className='text-2xl font-semibold'>Dashboard</h2>

        <div className='flex gap-3'>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='border px-3 py-2'
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className='border px-3 py-2'
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Total Perfumes Stock</p>
          <h3 className='text-2xl font-bold'>{totalPerfumesInStock}</h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Inventory Cost</p>
          <h3 className='text-2xl font-bold'>
            {currency}{totalInventoryValue.toFixed(2)}
          </h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Monthly Revenue</p>
          <h3 className='text-2xl font-bold'>
            {currency}{monthRevenue.toFixed(2)}
          </h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Monthly Profit</p>
          <h3 className='text-2xl font-bold'>
            {currency}{monthProfit.toFixed(2)}
          </h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Monthly Orders</p>
          <h3 className='text-2xl font-bold'>{selectedMonthOrders.length}</h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Monthly Customers</p>
          <h3 className='text-2xl font-bold'>{customers.size}</h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>Best Seller</p>
          <h3 className='text-lg font-bold'>
            {bestProducts[0] ? bestProducts[0][0] : 'No Data'}
          </h3>
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <p className='text-gray-500'>All Orders</p>
          <h3 className='text-2xl font-bold'>{orders.length}</h3>
        </div>

      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <h3 className='font-semibold mb-4'>Top Selling Products</h3>

          {bestProducts.length === 0 ? (
            <p>No products sold in this month</p>
          ) : (
            bestProducts.map(([name, quantity], index) => (
              <div key={index} className='flex justify-between border-b py-2'>
                <p>{name}</p>
                <p>{quantity} sold</p>
              </div>
            ))
          )}
        </div>

        <div className='bg-white border p-5 rounded shadow-sm'>
          <h3 className='font-semibold mb-4'>Orders By Day</h3>

          {dailyOrdersArray.length === 0 ? (
            <p>No orders in this month</p>
          ) : (
            dailyOrdersArray.map(([date, count], index) => (
              <div key={index} className='flex justify-between border-b py-2'>
                <p>{date}</p>
                <p>{count} orders</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard