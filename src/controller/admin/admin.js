const Schedule = require("../../model/Schedule");
const Subject = require("../../model/Subject");
const Transcript = require("../../model/Transcript");
const User = require("../../model/User");
const fs = require("fs");
const bcrypt = require("bcryptjs");
var isAdmin;

// Crete Admin
const createAdmin = async (req, res, next) => {
  try {
    const admin = new User(req.body);
    const foundUser = await User.findOne({ email: admin.email });
    if (foundUser) {
      throw new Error("This email is already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(admin.password, salt);
    admin.password = passHashed;
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
    const file = req.file;
    const foundUser = await User.findOne({ email: student.email });
    if (foundUser) {
      throw new Error("This email is already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(student.password, salt);
    // student.password = passHashed;
    await student.save();
    const transcript = new Transcript({ owner: student._id });
    const schedule = new Schedule({ owner: student._id });
    await transcript.save();
    await schedule.save();
    await student.update({
      password: passHashed,
      transcript: transcript._id,
      schedule: schedule._id,
      img: file ? file.filename : "",
    });
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
    const subjectList = [...transcript.subjects];
    const findDuplicate = subjectList
      .map((e) => {
        return e.subject.toString();
      })
      .indexOf(subject.subject.toString());
    if (findDuplicate > -1)
      throw new Error(
        "Subject with id: '" + subject.subject + "' is already exists"
      );
    transcript.subjects.push(subject);
    await transcript.save();
    return res.redirect("/admin/student/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};
// Delete student
const deleteStudent = async (req, res, next) => {
  try {
    const { studentID } = req.params;
    const student = await User.findById(studentID);
    const transcript = await Transcript.findOne({ owner: student._id });
    const schedule = await Schedule.findOne({ owner: student._id });
    await transcript.remove();
    await schedule.remove();
    if (student.img) {
      fs.unlink("src/public/uploads/avatar/" + student.img, (err, data) => {
        if (err) console.log(err);
      });
    }
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
    const { studentID } = req.query;
    const transcript = await Transcript.findById(transcriptID);
    const subjectFound = transcript.subjects.id(subjectID);
    subjectFound.remove();
    await transcript.save();
    return res.redirect("/admin/student/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};
// Form add student
const formAddStudent = async (req, res, next) => {
  try {
    return res.render("admin/add_student");
  } catch (err) {
    return res.send(err.message);
  }
};
// Get Admin
const getAdmin = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (user && user.type === "Admin") {
      const admin = await User.findById(user._id);
      return res.render("admin/edit_admin", { admin });
    }
    return res.send("Page not found");
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
    if (isAdmin) {
      const data = await User.find({ type: "Student" });
      return res.render("admin/student", { data });
    }
    return res.send("Page not found");
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

    res.render("admin/edit_student", {
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
// Update admin
const updateAdmin = async (req, res, next) => {
  try {
    const { adminID } = req.params;
    const admin = req.body;
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(admin.password, salt);
    admin.password = passHashed;
    await User.findByIdAndUpdate(adminID, admin);
    res.redirect("/admin");
  } catch (error) {
    return res.send(error.message);
  }
};
// Update student
const updateStudent = async (req, res, next) => {
  try {
    const { studentID } = req.params;
    const studentFound = await User.findById(studentID);
    const file = req.file;
    var img;
    if (file) {
      img = req.file.filename;
      fs.unlink(
        "src/public/uploads/avatar/" + studentFound.img,
        (err, data) => {
          if (err) console.log(err);
        }
      );
    } else {
      img = studentFound.img;
    }
    const student = { ...req.body, img };
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(student.password, salt);
    student.password = passHashed;
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
    const { studentID } = req.query;
    const transcript = await Transcript.findById(transcriptID);
    const subjectFound = transcript.subjects.id(subjectID);
    const subjectUpdate = await Subject.findOne({ name: req.body.subject });
    const subjectDefault = [...transcript.subjects];
    const subjectList = subjectDefault.filter((item) => {
      return item.subject.toString() !== subjectFound.subject.toString();
    });
    const findDuplicate = subjectList
      .map((e) => {
        return e.subject.toString();
      })
      .indexOf(subjectUpdate._id.toString());
    if (findDuplicate > -1)
      throw new Error("Subject : " + subjectUpdate.name + " is already exists");
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
  formAddStudent,
  getAdmin,
  getListAdmin,
  getListStudent,
  getStudent,
  getScript,
  updateAdmin,
  updateStudent,
  updateSubjectTranscript,
};
