import tasksSchema from "../../models/task.js"
import express from "express"
import createError from "http-errors"
import q2m from "query-to-mongo"

import { JWTAuthMiddleware } from "../../middlewares/auth/token.js"

const tasksRouter = express.Router()

//POST new Task
tasksRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newTask = new tasksSchema({ ...req.body, createdBy: req.user._id })
    const { _id } = await newTask.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//GET my tasks
tasksRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query)
    console.log(queryToMongo)
    const tasks = await tasksSchema.find({ ...queryToMongo.criteria, createdBy: req.user._id })
    // .limit(queryToMongo.options.limit)
    // .skip(queryToMongo.options.skip)
    // .sort(queryToMongo.options.sort)

    if (tasks) res.status(200).send(tasks)
    else next(createError(404, `no task found`))
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//PUT Task
tasksRouter.put("/:taskId", JWTAuthMiddleware, async (req, res, next) => {
  // try {
  //   const task = await tasksSchema.findOne({ _id: req.params.taskId, createdBy: req.user._id })
  //   if (!task) {
  //     return next(createError(404, "Task not found or you do not have permission to modify this task"))
  //   }

  //   const updatedTask = await tasksSchema.findByIdAndUpdate(
  //     req.params.taskId,
  //     {
  //       ...req.body,
  //     },
  //     { new: true }
  //   )
  //   if (task) res.status(201).send(updatedTask)
  //   else next(createError(404, `No task found`))
  // } catch (error) {
  //   console.log(error)
  //   next(error)
  // }

  try {
    const updatedTask = await tasksSchema.findOneAndUpdate({ _id: req.params.taskId, createdBy: req.user._id }, req.body, { new: true })
    if (!updatedTask) {
      return next(createError(404, "Task not found or you do not have permission to modify this task"))
    }
    res.status(201).send(updatedTask)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

///DELETE task
tasksRouter.delete("/:taskId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedTask = await tasksSchema.findOneAndDelete({ _id: req.params.taskId, createdBy: req.user._id })
    if (!deletedTask) {
      return next(createError(404, "Task not found or you do not have permission to delete this task"))
    }

    res.status(200).send("Task was deleted successfully")
  } catch (error) {
    next(error)
  }
})

export default tasksRouter
