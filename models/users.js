import mongoose from "mongoose";


const usersSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true,
    default: "customer"
  },
  isBolcked: {
    type: Boolean,
    required: true,
    default: false
  },

  img: {
    type: String,
    required: true,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  },
});

const User = mongoose.model("users",usersSchema)

export default User ;