import dotenv from "dotenv"

dotenv.config()

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3004,
  dbURI: process.env.MONGO_CONNECTION,
  jwtSecret: process.env.JWT_SECRET,
  frontendDevUrl: process.env.FE_DEV_URL || "http://localhost:3000",
  frontendProdUrl: process.env.FE_PROD_URL,
}

if (!dbURI || !jwtSecret || !frontendProdUrl) {
  throw new Error("Missing required environment variables")
}
