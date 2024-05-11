import usersSchema from "../../models/user.js"
import express from "express"
import createError from "http-errors"
import q2m from "query-to-mongo"

import { JWTAuthMiddleware } from "../../middlewares/auth/token.js"
import { generateAccessToken } from "../../middlewares/auth/tools.js"

const usersRouter = express.Router()

//POST create a new token
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Verificar las credenciales del usuario
    const user = await usersSchema.checkCredentials(email, password)

    if (user) {
      if (!user.isVerified) {
        res.status(200).json({ isVerified: false, email })
      } else {
        const accessToken = await generateAccessToken({ _id: user._id, email })
        res.status(201).json({ accessToken, email, isVerified: true })
      }
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

//POST verify verification code, update isVerified and then create token
usersRouter.post("/verificationcode", async (req, res, next) => {
  try {
    const { email, code, password } = req.body

    const user = await usersSchema.checkCredentials(email, password)
    if (user) {
      console.log(user)
      if (user.randomNumber === code) {
        user.isVerified = true
        await user.save()

        const accessToken = await generateAccessToken({ _id: user._id, email })
        res.status(200).json({ accessToken, email, isVerified: true })
      } else {
        res.status(404).send("Invalid verification code")
      }
    } else {
      res.status(401).send("User not found")
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
        randomNumber: Math.floor(Math.random() * 10000),
      })
      const { _id } = await newUser.save()

      res.status(201).send(_id)
    } else next(createError(409, `user already exists`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// //Get searched users
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

// //Get yourself data
usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    //just send the token and you receive the data
    const user = await usersSchema.findById(req.user)
    if (user) res.status(200).send(user)
    else next(createError(404, `No user found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// //PUT account data
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

// //Delete user
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
