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
      enum: ["Admin", "Lecturer", "Student"],
      default: "Student",
    },
    subject: {
      type: String,
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
    },
    transcript: {
      type: Schema.Types.ObjectId,
      ref: "Transcript",
    },
    img: { type: String },
    phoneNumber: {
      type: String,
    },
    inbox: [
      {
        from: { type: String },
        active: { type: Boolean, default: false },
        title: { type: String },
        content: { type: String },
        pubDate: { type: String },
      },
    ],
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
