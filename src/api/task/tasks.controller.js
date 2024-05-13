import Task from "./tasks.routes.js"

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (task) {
      res.json(task)
    } else {
      res.status(404).json({ message: "Task not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createTask = async (req, res) => {
  const task = new Task({
    title: req.body.title,
    task: req.body.task,
  })

  try {
    const newTask = await task.save()
    res.status(201).json(newTask)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedTask)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: "Task deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
