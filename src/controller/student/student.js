const bcrypt = require("bcryptjs");
const News = require("../../model/News");
const Schedule = require("../../model/Schedule");
const Semester = require("../../model/Semester");
const Transcript = require("../../model/Transcript");
const User = require("../../model/User");
var user;
// Add subject to schedule
const addSubject = async (req, res, next) => {
  try {
    const scheduleID = user.schedule;
    const transcriptID = user.transcript;
    const subject = req.body;
    const schedule = await Schedule.findById(scheduleID).populate(
      "subjects.subject"
    );
    const transcript = await Transcript.findById(transcriptID).populate(
      "subjects.subject"
    );
    const scheduleList = [...schedule.subjects];
    const transcriptList = [...transcript.subjects];
    scheduleList.forEach(item=>{
      if(item.subject._id.toString() === subject.subject){
        return res.send("You are studying subject: " + item.subject.name);
      }
    });
    transcriptList.forEach(item=>{
      if(item.subject._id.toString() === subject.subject){
        return res.send("You have passed this subject: " + item.subject.name);
      }
    });
    schedule.subjects.push(subject);
    await schedule.save();
    res.redirect("/student/registration");
  } catch (error) {
    return res.send(error.message);
  }
};
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
// Get News's details
const getNews = async (req, res, next) => {
  try {
    const { newsID } = req.params;
    const news = await News.findById(newsID);
    return res.render("student/get_news", { news, user });
  } catch (error) {
    return res.send(error.message);
  }
};
// Home Page
const home = async (req, res, next) => {
  try {
    user = req.session.user;
    if (user && user.type === "Student") {
      const learning = await News.find({ type: "Learning" });
      const activities = await News.find({ type: "Activities" });
      const fees = await News.find({ type: "Fees" });
      return res.render("student/home", { learning, activities, fees, user });
    }
    return res.send("Page not found");
  } catch (err) {
    res.send(err.message);
  }
};
// Profile Page
const profile = async (req, res, next) => {
  try {
    const studentID = user._id;
    const student = await User.findById(studentID);
    return res.render("student/profile", { student, user });
  } catch (error) {
    return res.send(error.message);
  }
};
// Registration Page
const registration = async (req, res, next) => {
  try {
    const semester = await Semester.findOne({ name: "Fall 2020" }).populate(
      "subjects"
    );
    const data = semester.subjects;

    return res.render("student/registration", { data, user });
  } catch (error) {
    return res.send(error.message);
  }
};

// Schedule Page
const schedule = async (req, res, next) => {
  try {
    const scheduleID = user.schedule;
    const schedule = await Schedule.findById(scheduleID).populate(
      "subjects.subject"
    );
    const data = [...schedule.subjects];
    const scheduleList = [];
    // Create data in table in schedule
    data.forEach((item) => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      var stringDate;
      for (start; start <= end; start.setDate(start.getDate() + 1)) {
        var date = start.getDate();
        var month = start.getMonth() + 1;
        var year = start.getFullYear();
        var day = start.getDay() + 1;
        stringDate =
          (date < 10 ? "0" + date : date) +
          "/" +
          (month < 10 ? "0" + month : month) +
          "/" +
          year;
        const subject = {
          subjectID: item.subject.subjectID,
          name: item.subject.name,
          shift: item.shift,
          block: item.block,
          stringDate: stringDate,
          date: start,
        };
        if (item.days === "Even") {
          if (day % 2 == 0) {
            scheduleList.push(subject);
          }
        } else if (item.days === "Odd") {
          if (day % 2 != 0 && day != 1) {
            scheduleList.push(subject);
          }
        }
      }
    });
    scheduleList.sort((a,b)=>{
      var dateA = new Date(a.date).getTime();
      var dateB = new Date(b.date).getTime();
      if(dateA > dateB) return 1;
      if(dateA<dateB) return -1;
      return 0;
    })
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const startSlice = (page - 1) * perPage;
    const endSlice = page * perPage;
    const maxPage = Math.ceil(scheduleList.length / perPage);
    return res.render("student/schedule", {
      user,
      data: scheduleList.slice(startSlice, endSlice),
      maxPage,
      page,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
// Transcript Page
const transcript = async (req, res, next) => {
  try {
    const studentID = user._id;
    const transcript = await Transcript.findOne({ owner: studentID }).populate({
      path: "subjects.subject",
    });
    return res.render("student/transcript", {
      transcript: transcript.subjects,
      user,
    });
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports = {
  addSubject,
  changePassword,
  getNews,
  home,
  profile,
  registration,
  schedule,
  transcript,
};
