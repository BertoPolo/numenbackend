import mongoose from "mongoose"

const { Schema, model } = mongoose

const tasksSchema = new Schema(
  {
    task: { type: String, required: true, trim: true, maxlength: 150 },
  },
  { timestamps: true }
)

export default model("Tasks", tasksSchema)
