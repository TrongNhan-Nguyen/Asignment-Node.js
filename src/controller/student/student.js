const bcrypt = require("bcryptjs");
const News = require("../../model/News");
const Transcript = require("../../model/Transcript");
const User = require("../../model/User");
var user;
// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { currentPass, password } = req.body;
    const studentID = user._id;
    const student = await User.findById(studentID);
    const checkPass = await bcrypt.compare(currentPass, user.password);
    if (checkPass) {
      const salt = await bcrypt.genSalt(10);
      const passHashed = await bcrypt.hash(password, salt);
      student.password = passHashed;
      await student.save();
      res.redirect("/student/profile");
    }
    return res.send(
      "Your password is not correctly, if you forget your password, please contact to admin"
    );
  } catch (error) {
    return res.send(error.message);
  }
};
// Get News
const getNews = async (req, res, next) => {
  try {
    const { newsID } = req.params;
    const news = await News.findById(newsID);
    return res.render("student/get_news", { news,user });
  } catch (error) {
    return res.send(error.message);
  }
};
// Get Profile
const getProfile = async (req, res, next) => {
  try {
    const studentID = user._id;
    const student = await User.findById(studentID);
    return res.render("student/get_profile", { student ,user});
  } catch (error) {
    return res.send(error.message);
  }
};
// Get Transcript
const getTranscript = async (req, res, next) => {
  try {
    const studentID = user._id;
    const transcript = await Transcript.findOne({ owner: studentID }).populate({
      path: "subjects.subject",
    });
    return res.render("student/get_transcript", {
      transcript: transcript.subjects,
      user,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
// Home Page
const home = async (req, res, next) => {
  try {
    user = req.session.user;
    if (user && user.type === "Student") {
      const learning = await News.find({type:'Learning'});
      const activities = await News.find({type:'Activities'});
      const fees = await News.find({type:'Fees'});
      return res.render("student/home",{learning,activities,fees,user});
    }
    return res.send("Page not found");
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = {
  changePassword,
  getNews,
  getProfile,
  getTranscript,
  home,
};
