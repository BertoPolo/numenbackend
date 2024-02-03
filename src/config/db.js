import mongoose from "mongoose"
import express from "express"

import listEndpoints from "express-list-endpoints"

const connectDB = async () => {
  const server = express()
  const port = process.env.PORT || 3004

  mongoose.connect(process.env.MONGO_CONNECTION)

  mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo")
  })
}
export default connectDB
