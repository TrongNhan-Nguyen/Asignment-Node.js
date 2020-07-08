const User = require("../model/User");
const Transcript = require("../model/Transcript");
const Subject = require("../model/Subject");
var isAdmin;

// Crete Admin
const createAdmin = async (req, res, next) => {
  try {
    const admin = new User(req.body);
    const foundUser = await User.findOne({ email: admin.email });
    if (foundUser) {
      throw new Error("This email is already exists");
    }
    await admin.save();
    return res.redirect("/admin");
  } catch (err) {
    res.send(err.message);
  }
};
// Create student
const createStudent = async (req, res, next) => {
  try {
    const student = new User(req.body);
    const foundUser = await User.findOne({ email: student.email });
    if (foundUser) {
      throw new Error("This email is already exists");
    }
    await student.save();
    const transcript = new Transcript({ owner: student._id });
    await transcript.save();
    await student.update({ transcript: transcript._id });
    res.redirect("/admin/student");
  } catch (err) {
    res.send(err.message);
  }
};
// Create subject in transcripts
const createSubjectTranscript = async (req, res, next) => {
  try {
    const { transcriptID } = req.params;
    const { studentID } = req.query;
    const subject = req.body;
    const transcript = await Transcript.findById(transcriptID);
    transcript.subjects.push(subject);
    await transcript.save();
    res.redirect("/admin/student/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};
// Delete student
const deleteStudent = async (req, res, next) => {
  try {
    const { studentID } = req.params;
    const student = await User.findById(studentID);
    const transcript = await Transcript.findOne({owner: student._id});
    await transcript.remove();
    await student.remove();
    res.redirect("/admin/student");
  } catch (err) {
    res.send(err.message);
  }
};
// Delete subject in transcript
const deleteSubjectTranscript = async (req, res, next) => {
  try {
    const { transcriptID, subjectID } = req.params;
    const {studentID} = req.query;
    const transcript = await Transcript.findById(transcriptID);
    const subjectFound = transcript.subjects.id(subjectID);
    subjectFound.remove();
    await transcript.save();
    return res.redirect("/admin/student/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};
// Get list admin
const getListAdmin = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (user && user.type === "Admin") {
      isAdmin = true;
      const data = await User.find({ type: "Admin" });
      return res.render("admin/home", { data });
    }
    isAdmin = false;
    return res.send("Page not found");
  } catch (err) {
    next(err);
  }
};
// Get list student
const getListStudent = async (req, res, next) => {
  try {
    // if(isAdmin){
    // const data = await User.find({ type: "Student" });
    // return res.render("admin/student", { data });
    // }
    // return res.send("Page not found");
    const data = await User.find({ type: "Student" });
    return res.render("admin/student", { data });
  } catch (err) {
    next(err);
  }
};
// Get information student
const getStudent = async (req, res, next) => {
  try {
    const { studentID } = req.params;
    const subjects = await Subject.find({}).sort("name");
    const student = await User.findById(studentID);
    const transcriptID = student.transcript;
    const transcript = await Transcript.findById(transcriptID).populate({
      path: "subjects.subject",
    });

    res.render("admin/edit", {
      student,
      transcript: transcript.subjects,
      subjects,
    });
  } catch (err) {
    res.render(err);
  }
};
// Get script
const getScript = async (req, res, next) => {
  try {
    const { transcriptID } = req.params;
    const transcript = await Transcript.findById(transcriptID).populate({
      path: "subjects.subject",
    });

    console.log(transcript.subjects);
  } catch (error) {
    return res.send(error.message);
  }
};
// Update student
const updateStudent = async (req, res, next) => {
  try {
    const { studentID } = req.params;
    const student = req.body;
    await User.findByIdAndUpdate(studentID, student);
    res.redirect("/admin/student");
  } catch (err) {
    res.send(err.message);
  }
};
// Update subject transcript
const updateSubjectTranscript = async (req, res, next) => {
  try {
    const { transcriptID, subjectID } = req.params;
    const {studentID} = req.query;
    const transcript = await Transcript.findById(transcriptID);
    const subjectFound = transcript.subjects.id(subjectID);
    const subjectUpdate = await Subject.findOne({ name: req.body.subject });
    subjectFound.set({ ...req.body, subject: subjectUpdate._id });
    await transcript.save();
    return res.redirect("/admin/student/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports = {
  createAdmin,
  createStudent,
  createSubjectTranscript,
  deleteStudent,
  deleteSubjectTranscript,
  getListAdmin,
  getListStudent,
  getStudent,
  getScript,
  updateStudent,
  updateSubjectTranscript,
};
