import mongoose from "mongoose"

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_CONNECTION)

  mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo")
  })
}
export default connectDB
