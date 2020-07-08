const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TranscriptSchema = new Schema(
  {
    subjects: [
      {
        subject: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          index: true,
          unique: true,
        },
        scores: { type: Number },
        status: {
          type: String,
          enum: ["Fail", "Learning", "Passed"],
          default: "Learning",
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
  },
  { collection: "Transcript" }
);
const Transcript = mongoose.model("Transcript", TranscriptSchema);
module.exports = Transcript;
