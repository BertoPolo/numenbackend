import mongoose from "mongoose"

const { Schema, model } = mongoose

const taskSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const tasksListSchema = new Schema(
  {
    tasks: [taskSchema],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

export default model("TasksList", tasksListSchema)
