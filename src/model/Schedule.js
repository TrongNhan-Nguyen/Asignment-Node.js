const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema(
  {
    subjects: [
      {
        subject: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
        },
        startDate: { type: String },
        endDate: { type: String },
        shift: { type: Number },
        block: { type: Number },
        days: { type: String, enum: ["Odd", "Even"] },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "Schedule" }
);
module.exports = mongoose.model("Schedule", ScheduleSchema);
