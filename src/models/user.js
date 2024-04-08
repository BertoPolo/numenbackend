import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    // phone: { type: String, trim: true }, should be encrypted?
    // prefix: { type: String, trim: true },IF PHONE=> required
  },
  { timestamps: true }
)

//protect passwords
usersSchema.pre("save", async function (next) {
  const currentUser = this
  const plainPW = this.password

  if (currentUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 11)
    currentUser.password = hash
  }
  next()
})

//delete password and __v in any res.send
usersSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

usersSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email })

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)

    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model("Users", usersSchema)
