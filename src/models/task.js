import mongoose from "mongoose"

const { Schema, model, Types } = mongoose

const tasksSchema = new Schema(
  {
    task: { type: String, required: true, trim: true, maxlength: 150 },
    title: { type: String, required: true, trim: true, maxlength: 20 },
    done: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: "Users", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

export default model("Tasks", tasksSchema)
