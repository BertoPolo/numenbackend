import usersSchema from "./model.js"
import express from "express"
import createError from "http-errors"
import q2m from "query-to-mongo"

import { JWTAuthMiddleware } from "../auth/token.js"
import { generateAccessToken } from "../auth/tools.js"

const usersRouter = express.Router()

//POST create a new token
usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const user = await usersSchema.checkCredentials(email, password)

    if (user) {
      // 3. If credentials are ok --> generate an access token and send it as a response

      const accessToken = await generateAccessToken({ _id: user._id })
      res.status(201).send({ accessToken })
    } else {
      // 4. If credentials are not ok --> throw an error (401)
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

//POST a new user
usersRouter.post("/", async (req, res, next) => {
  try {
    const emailLowerCase = req.body.email.toLowerCase()

    const doesUserAlreadyExists = await usersSchema.findOne({ email: emailLowerCase })
    if (!doesUserAlreadyExists) {
      const newUser = new usersSchema({
        ...req.body,
        email: emailLowerCase,
      })
      const { _id } = await newUser.save()

      res.status(201).send(_id)
    } else next(createError(409, `user already exists`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Get searched users
usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query)
    console.log(queryToMongo)
    const users = await usersSchema
      .find(queryToMongo.criteria)
      .limit(queryToMongo.options.limit)
      .skip(queryToMongo.options.skip)
      .sort(queryToMongo.options.sort)

    if (users) res.status(200).send(users)
    else next(createError(404, `no users found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//PUT account data
usersRouter.put("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await usersSchema.findByIdAndUpdate(
      req.params.userId,
      {
        ...req.body,
      },
      { new: true }
    )
    if (user) res.status(201).send(user)
    else next(createError(404, `no users found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//Delete user
usersRouter.delete("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userToDelete = await usersSchema.findByIdAndDelete(req.params.userId)

    if (userToDelete) res.status(200).send({ message: "deleted successfully" })
    else next(createError(404, `User not found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default usersRouter
