import Task from "./tasks.routes.js"

export const getSelfTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
    res.json(tasks)
  } catch (error) {
    next(new createError(500, error.message))
  }
}

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })
    if (!task) {
      return next(new createError(404, "Task not found"))
    }
    res.json(task)
  } catch (error) {
    next(new createError(500, error.message))
  }
}

export const createTask = async (req, res, next) => {
  const newTask = new Task({
    ...req.body,
    createdBy: req.user._id,
  })

  try {
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    next(new createError(400, error.message))
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, runValidators: true })
    if (!updatedTask) {
      return next(new createError(404, "Task not found"))
    }
    res.json(updatedTask)
  } catch (error) {
    next(new createError(400, error.message))
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    if (!deletedTask) {
      return next(new createError(404, "Task not found"))
    }
    res.status(200).json({ message: "Task deleted successfully" })
  } catch (error) {
    next(new createError(500, error.message))
  }
}
