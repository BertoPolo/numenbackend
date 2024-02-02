import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import createError from "http-errors"

import usersRouter from "./api/user/users.routes.js"
import tasksRouter from "./api/task/tasks.routes.js"

import { genericErrorHandler, notFoundErrorHandler, badRequestErrorHandler, unauthorizedErrorHandler } from "./middlewares/errorHandlers.js"
import apiLimiter from "./middlewares/requestRestriction.js"

mongoose.set("strictQuery", false)

const server = express()
const port = process.env.PORT || 3001
const urlList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

//****************** MIDDLEWARES *********************
server.use(
  cors({
    origin: (origin, next) => {
      if (!origin || urlList.indexOf(origin) !== -1) {
        next(null, true)
      } else {
        next(createError(400, "CORS ERROR!"))
      }
    },
  })
)
server.use(express.json())

// ****************** ENDPOINTS  *********************
server.use("/tasks", tasksRouter)
server.use("/users", usersRouter)

// ****************** TOOLS *********************
server.use(apiLimiter)

// ****************** ERROR HANDLERS *********************
server.use(badRequestErrorHandler) // 400
server.use(unauthorizedErrorHandler) // 401
server.use(notFoundErrorHandler) // 404
server.use(genericErrorHandler) // 500

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo")

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
