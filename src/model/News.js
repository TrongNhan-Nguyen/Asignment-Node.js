const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Learning", "Activities", "Fees"],
      required: true,
    },
    time: { type: Date, default: Date.now() },
  },
  { collection: "News" }
);
module.exports = mongoose.model("News", NewsSchema);
