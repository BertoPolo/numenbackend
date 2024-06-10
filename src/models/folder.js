import mongoose from "mongoose"

const { Schema, model, Types } = mongoose

const folderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 15, default: "Main" },
    // createdBy: { type: Types.ObjectId, ref: "Users", required: true },
    // tasks: [{ type: Types.ObjectId, ref: "Tasks", required: true }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const Folder = model("Folder", folderSchema)

export default Folder
