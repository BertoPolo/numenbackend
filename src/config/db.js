import mongoose from "mongoose"
import config from "./index.js"

const connectDB = async () => {
  mongoose.connect(config.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo")
  })
}

export default connectDB
