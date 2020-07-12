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
    const isMobile = req.header("Accept").includes("application/json");
    if(isMobile){
      const {studentID} = req.query;
      const user = await User.findById(studentID);
      const scheduleID = user.schedule;
      const transcriptID = user.transcript;
      const subject = req.body;
      var check = false;
      const schedule = await Schedule.findById(scheduleID).populate(
        "subjects.subject"
      );
      const transcript = await Transcript.findById(transcriptID).populate(
        "subjects.subject"
      );
      const transcriptList = [...transcript.subjects];
      transcriptList.forEach((item) => {
        if (item.subject._id.toString() === subject.subject) {
          return (check = true);
        }
      });
      if (check) return res.status(201).send("You have passed or studying this subject");
  
      const subjectTranscript = {
        subject: subject.subject,
        scores: 0,
        status: "Learning",
      };
      transcript.subjects.push(subjectTranscript);
      schedule.subjects.push(subject);
      await schedule.save();
      await transcript.save();
      return res.status(200).send("Registration successfully");
    }
    const scheduleID = user.schedule;
    const transcriptID = user.transcript;
    const subject = req.body;
    var check = false;
    const schedule = await Schedule.findById(scheduleID).populate(
      "subjects.subject"
    );
    const transcript = await Transcript.findById(transcriptID).populate(
      "subjects.subject"
    );
    const transcriptList = [...transcript.subjects];
    transcriptList.forEach((item) => {
      if (item.subject._id.toString() === subject.subject) {
        return (check = true);
      }
    });
    if (check) return res.send("You have passed or studying this subject");

    const subjectTranscript = {
      subject: subject.subject,
      scores: 0,
      status: "Learning",
    };
    transcript.subjects.push(subjectTranscript);
    schedule.subjects.push(subject);
    await schedule.save();
    await transcript.save();
    return res.redirect("/student/schedule");
  } catch (error) {
    return res.send(error.message);
  }
};
// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { currentPass, password } = req.body;
    const isMobile = req.header("Accept").includes("application/json");
    if (isMobile) {
      const {studentID} = req.query;
      const student = await User.findById(studentID);
      const checkPass = await bcrypt.compare(currentPass, student.password);
      if (checkPass) {
        const salt = await bcrypt.genSalt(10);
        const passHashed = await bcrypt.hash(password, salt);
        student.password = passHashed;
        await student.save();
        return res.status(200).send("Update successfully");
      }
      return  res.status(201).send("Your current password incorrect");
    };
    

    const studentID = user._id;
    const student = await User.findById(studentID);
    const checkPass = await bcrypt.compare(currentPass, user.password);
    if (checkPass) {
      const salt = await bcrypt.genSalt(10);
      const passHashed = await bcrypt.hash(password, salt);
      student.password = passHashed;
      await student.save();
     return res.redirect("/student/profile");
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
    const isMobile = req.header("Accept").includes("application/json");

    const { newsID } = req.params;
    const news = await News.findById(newsID);
    if (isMobile) return res.status(200).send(news);
    return res.render("student/get_news", { news, user });
  } catch (error) {
    return res.send(error.message);
  }
};
// Home Page
const home = async (req, res, next) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");
    const news = await News.find({});
    if (isMobile) return res.status(200).send(news);

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
    const isMobile = req.header("Accept").includes("application/json");
    if (isMobile) {
      const {studentID} = req.query;
      const student = await User.findById(studentID);
      return res.status(200).send(student);
    };
    
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
    const isMobile = req.header("Accept").includes("application/json");
    const semester = await Semester.findOne({ name: "Fall 2020" }).populate(
      "subjects"
    );
    const data = semester.subjects;
    if(isMobile) return res.status(200).send(data);
    return res.render("student/registration", { data, user });
  } catch (error) {
    return res.send(error.message);
  }
};

// Schedule Page
const schedule = async (req, res, next) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");
    if(isMobile){
      const {userID} = req.query;
      const userFound = await User.findById(userID);
      const schedule = await Schedule.findById(userFound.schedule).populate(
        "subjects.subject"
      );
      const data = [...schedule.subjects];
      const scheduleList = [];
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
      scheduleList.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        if (dateA > dateB) return 1;
        if (dateA < dateB) return -1;
        return 0;
      });
      return res.status(200).send(scheduleList);
    }


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
    scheduleList.sort((a, b) => {
      var dateA = new Date(a.date).getTime();
      var dateB = new Date(b.date).getTime();
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;
      return 0;
    });

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
    const isMobile = req.header("Accept").includes("application/json");
    if (isMobile) {
      const { userID } = req.query;
      const transcript = await Transcript.findOne({ owner: userID }).populate({
        path: "subjects.subject",
      });
      const data = [...transcript.subjects];
      return res.status(200).send(data);
    }
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
