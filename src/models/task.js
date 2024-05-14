import mongoose from "mongoose"

const { Schema, model, Types } = mongoose

const tasksSchema = new Schema(
  {
    task: { type: String, required: true, trim: true, maxlength: 150 },
    title: { type: String, required: true, trim: true, maxlength: 20 },
    done: { type: Boolean, default: false },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    createdBy: { type: Types.ObjectId, ref: "Users", required: true },
    folder: { type: Types.ObjectId, ref: "Folder" },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

export default model("Tasks", tasksSchema)
