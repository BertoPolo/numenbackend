import createError from "http-errors"
import { verifyAccessToken } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  // 1. Check if authorization header is in the request, if it is not --> 401
  if (!req.headers.authorization) {
    next(createError(401, "Please provide bearer token in the authorization header!"))
  } else {
    try {
      // 2. Extract the token from authorization header
      const token = req.headers.authorization.replace("Bearer ", "")

      // 3. Verify token (verify expiration date and check signature integrity), if everything is fine should get back the payload ({_id})
      const payload = await verifyAccessToken(token)

      // 4. If token is ok --> next
      req.user = {
        _id: payload._id,
      }

      next()
    } catch (error) {
      console.log(error)
      // 5. If the token is NOT ok
      next(createError(401, "Token not valid!"))
    }
  }
}
