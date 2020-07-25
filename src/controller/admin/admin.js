const Schedule = require("../../model/Schedule");
const Subject = require("../../model/Subject");
const Transcript = require("../../model/Transcript");
const User = require("../../model/User");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const session = require("express-session");
var isAdmin, user;

// Crete Admin
const createAdmin = async (req, res, next) => {
  try {
    const admin = new User(req.body);
    const file = req.file;

    const foundUser = await User.findOne({ email: admin.email });
    if (foundUser) {
      throw new Error("This email is already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(admin.password, salt);
    admin.password = passHashed;
    (admin.img = file ? file.filename : ""), await admin.save();
    return res.redirect("/admin");
  } catch (err) {
    res.send(err.message);
  }
};
// Create student
const createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const file = req.file;
    var img;
    const foundUser = await User.findOne({ email: user.email });
    if (foundUser) {
      throw new Error("This email is already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(user.password, salt);
    if(file){
      img = file.filename;
    }else{
      img = "";
    }
    user.password = passHashed;
    user.img = img;
    await user.save();
    if (user.type == "Lecturer") {
      return res.redirect("/admin/user");
    }
    const transcript = new Transcript({ owner: user._id });
    const schedule = new Schedule({ owner: user._id });
    await transcript.save();
    await schedule.save();
    user.transcript = transcript._id;
    user.schedule = schedule._id;
    await user.save();
    return res.redirect("/admin/user");
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
    return res.redirect("/admin/user/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};
// Delete student
const deleteUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID);
    await user.remove();
    if (user.img) {
      fs.unlink("src/public/uploads/avatar/" + user.img, (err, data) => {
        if (err) console.log(err);
      });
    }
    if(user.type == "Lecturer"){
     return res.redirect("/admin/user");
    }
    const transcript = await Transcript.findOne({ owner: user._id });
    const schedule = await Schedule.findOne({ owner: user._id });
    await transcript.remove();
    await schedule.remove();
    return res.redirect("/admin/user");
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
    return res.redirect("/admin/user/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};
// Form add student
const formAddUser = async (req, res, next) => {
  try {
    if(isAdmin) {
      const data = await Subject.find({})
      .select({ name: 1, _id: 0 })
      .sort("name");
      return res.render("admin/add_user", { data,user });
    };
    return res.send('Page not found');
   
  } catch (err) {
    return res.send(err.message);
  }
};
// Get Admin
const getAdmin = async (req, res, next) => {
  try {
    user = req.session.user;

    if (user.type == "Admin" || user.type=="Lecturer") {
      const admin = await User.findById(user._id);
      return res.render("admin/edit_admin", { admin ,user});
    }
    return res.send("Page not found");
  } catch (error) {
    return res.send(error.message);
  }
};
// Get list admin
const getListAdmin = async (req, res, next) => {
  try {
     user = req.session.user;
    if (user && user.type == "Student") {
      isAdmin = false;
      return res.send("Page not found");
    }
    isAdmin = true;
    const data = await User.find({ type: "Admin" });
    return res.render("admin/home", { data,user });
  } catch (err) {
    next(err);
  }
};
// Get list student
const getListUser = async (req, res, next) => {
  try {
    if (isAdmin) {
      const studentList = await User.find({ type: "Student" });
      const lecturerList = await User.find({ type: "Lecturer" });
      return res.render("admin/user", { studentList,lecturerList,user });
    }
    return res.send("Page not found");
  } catch (err) {
    next(err);
  }
};
// Get information student
const getUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const subjects = await Subject.find({}).sort("name");
    const userUpdate = await User.findById(userID);
    if(userUpdate.type == "Lecturer"){
      return res.render("admin/edit_user", {user,subjects,userUpdate});
    }
    const transcriptID = userUpdate.transcript;
    const transcript = await Transcript.findById(transcriptID).populate({
      path: "subjects.subject",
    });
    return res.render("admin/edit_user", {
      userUpdate,
      transcript: transcript.subjects,
      subjects,
      user,
    });
  } catch (err) {
    return res.render(err);
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
    const file = req.file;
    const adminFound = await User.findById(adminID);
    var img;
    if (file) {
      img = req.file.filename;
      if (adminFound.img) {
        fs.unlink(
          "src/public/uploads/avatar/" + adminFound.img,
          (err, data) => {
            if (err) console.log(err);
          }
        );
      }
    } else {
      img = adminFound.img;
    }
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(admin.password, salt);
    if (admin.password == adminFound.password) {
      admin.password = adminFound.password;
    } else {
      admin.password = passHashed;
    }
    admin.img = img;
    await User.findByIdAndUpdate(adminID, admin);
    res.redirect("/admin");
  } catch (error) {
    return res.send(error.message);
  }
};
// Update student
const updateUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const userFound = await User.findById(userID);
    const file = req.file;
    var img;
    if (file) {
      img = req.file.filename;
      if (userFound.img) {
        fs.unlink(
          "src/public/uploads/avatar/" + userFound.img,
          (err, data) => {
            if (err) console.log(err);
          }
        );
      }
    } else {
      img = userFound.img;
    }
    const user = { ...req.body, img };
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(user.password, salt);
    if (user.password == userFound.password) {
      user.password == userFound.password;
    } else {
      user.password = passHashed;
    }
    await User.findByIdAndUpdate(userID, user);
    res.redirect("/admin/user");
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
    return res.redirect("/admin/user/edit/" + studentID);
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports = {
  createAdmin,
  createUser,
  createSubjectTranscript,
  deleteUser,
  deleteSubjectTranscript,
  formAddUser,
  getAdmin,
  getListAdmin,
  getListUser,
  getUser,
  getScript,
  updateAdmin,
  updateUser,
  updateSubjectTranscript,
};
