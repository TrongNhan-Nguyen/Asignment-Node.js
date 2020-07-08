const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SemesterSchema = new Schema({
  name: { type: String, index: true, unique: true, required: true },
  subjects:[{
      type: Schema.Types.ObjectId,
      ref: "Subject",
  }]
},{collection:"Semester"});

const Semester = mongoose.model("Semester",SemesterSchema);
module.exports = Semester;