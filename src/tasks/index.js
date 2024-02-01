import tasksSchema from "./model.js"
import express from "express"
import createError from "http-errors"
import q2m from "query-to-mongo"

import { JWTAuthMiddleware } from "../auth/token.js"

const tasksRouter = express.Router()

//POST new Task
tasksRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newTask = new brandsSchema(req.body)
    const { _id } = await newTask.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//GET ALL Tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query)
    console.log(queryToMongo)
    const tasks = await tasksSchema
      .find(queryToMongo.criteria)
      .limit(queryToMongo.options.limit)
      .skip(queryToMongo.options.skip)
      .sort(queryToMongo.options.sort)

    if (tasks) res.status(200).send(tasks)
    else next(createError(404, `no task found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//PUT Task
tasksRouter.put("/:taskId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const task = await tasksSchema.findByIdAndUpdate(
      req.params.taskId,
      {
        ...req.body,
      },
      { new: true }
    )
    if (task) res.status(201).send(task)
    else next(createError(404, `no task found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

///DELETE task
tasksRouter.delete("/:taskId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const tasksToDelete = await tasksSchema.findByIdAndDelete(req.params.taskId)

    if (tasksToDelete) {
      res.status(200).send("task was deleted successfully")
    } else next(createError(404, `this task: ${req.params.taskId}, is not found`))
  } catch (error) {
    next(error)
  }
})

export default tasksRouter
