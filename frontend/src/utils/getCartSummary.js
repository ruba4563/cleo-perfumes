export function getCartSummary(lines, products) {
  const productsById = new Map(
    products.map((product) => [String(product._id), product]),
  )

  const items = lines.flatMap((line) => {
    const product = productsById.get(line.productId)
    if (!product) return []

    const image = Array.isArray(product.image) ? product.image[0] : product.image
    const imageUrl = typeof image === 'string'
      ? image
      : image?.filePath || image?.secure_url
    const offerPrice = Number(product.offerPrice)
    const unitPrice = offerPrice > 0 ? offerPrice : Number(product.price)

    return [{
      ...line,
      name: product.name,
      imageUrl,
      lineTotal: unitPrice * line.quantity,
    }]
  })

  return {
    items,
    subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
  }
}