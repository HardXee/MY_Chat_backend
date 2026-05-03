import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
   name: {
    type: String,
    required: true
   },
   email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  friends:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

export default mongoose.model("User", userSchema);