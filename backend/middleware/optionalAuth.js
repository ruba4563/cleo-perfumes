import jwt from 'jsonwebtoken'

const optionalAuth = async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    return next()
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = token_decode.id
    next()
  } catch (error) {
    console.log(error)
    next()
  }
}

export default optionalAuth