const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    type: {
      type: String,
      enum: ["Admin", "Student"],
      default: "Student",
    },
    schedule:{
      type: Schema.Types.ObjectId,
      ref: "Schedule",
    },
    transcript: {
      type: Schema.Types.ObjectId,
      ref: "Transcript",
    },
    img:{type:String},
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    sex: {
      type: String,
      enum: ["Male", "Female"],
    },
    class: { type: String },
    birthday: { type: String },
    specialized: { type: String },
  },
  { collection: "User" }
);
const User = mongoose.model("User", UserSchema);
module.exports = User;
