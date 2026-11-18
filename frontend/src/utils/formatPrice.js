export const formatPrice = new Intl.NumberFormat('en-JO', {
  style: 'currency',
  currency: 'JOD',
  currencyDisplay: 'code',
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
})