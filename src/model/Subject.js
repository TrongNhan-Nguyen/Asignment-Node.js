const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  subjectID: {
    type: String,
    index: true,
    unique: true,
    required: true,
    uppercase: true,
  },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
},{collection:"Subject"});

const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
