const bcrypt = require("bcryptjs");
const fs = require("fs");
const News = require("../../model/News");
const Schedule = require("../../model/Schedule");
const Semester = require("../../model/Semester");
const Transcript = require("../../model/Transcript");
const User = require("../../model/User");
var user,
  notActive = 0;
// Add subject to schedule
const addSubject = async (req, res, next) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");
    const subject = req.body;
    var scheduleID, transcriptID;
    var check = false;
    if (user) {
      scheduleID = user.schedule;
      transcriptID = user.transcript;
    } else {
      const { studentID } = req.query;
      const user = await User.findById(studentID);
      scheduleID = user.schedule;
      transcriptID = user.transcript;
    }

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
    if (check) {
      if (isMobile)
        return res.status(201).send("You have passed or studying this subject");
      return res.send("You have passed or studying this subject");
    }

    const subjectTranscript = {
      subject: subject.subject,
      scores: 0,
      status: "Learning",
    };
    transcript.subjects.push(subjectTranscript);
    schedule.subjects.push(subject);
    await schedule.save();
    await transcript.save();
    if (isMobile)
      return res
        .status(200)
        .send("Registration successfully you can check your schedule now");
    return res.redirect("/student/schedule");
  } catch (error) {
    return res.send(error.message);
  }
};
// Get email
const getEmail = async (req, res) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");
    const { emailID } = req.params;
    var email,index,userFound,length;

    if(user){
      userFound = await User.findById(user._id);
      length = user.inbox.length;
    }else{
      const {userID} = req.query;
      userFound = await User.findById(userID);
      length = userFound.inbox.length;
    }

    for (var i = 0; i < length; i++) {
      var temp = user ? user.inbox[i] : userFound.inbox[i];
      if (temp._id == emailID) {
        email = temp;
        index = i;
        break;
      }
    }
    
    if (userFound.inbox[index].active == false) {
      userFound.inbox[index].active = true;
      await userFound.save();
      notActive = 0;
    }
    userFound.inbox.forEach((item) => {
      if (item.active == false) {
        notActive++;
      }
    });
    if(isMobile)return res.send("Activated this email");
    user = userFound;
    return res.render("student/get_email", { user, notActive, email });
  } catch (error) {
    return res.send(error.message);
  }
};
// Get List email
const getListEmail = async (req, res) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");
    var data;
    if(user){
      data = user.inbox;
    }else{
      const {userID} = req.query;
      const userFound = await User.findById(userID);
      data = userFound.inbox;
    }

    if(isMobile)return res.send(data);
    
    return res.render("student/email", { user, notActive, data });
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
    return res.render("student/get_news", { news, user, notActive });
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
    notActive = 0;
    user = req.session.user;
    user.inbox.forEach((item) => {
      if (item.active == false) {
        notActive++;
      }
    });

    if (user && user.type === "Student") {
      const learning = await News.find({ type: "Learning" });
      const activities = await News.find({ type: "Activities" });
      const fees = await News.find({ type: "Fees" });
      return res.render("student/home", {
        learning,
        activities,
        fees,
        user,
        notActive,
      });
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
    var studentID;
    if (user) {
      studentID = user._id;
    } else {
      studentID = req.query.studentID;
    }
    const student = await User.findById(studentID);
    if (isMobile) {
      return res.status(200).send(student);
    }
    return res.render("student/profile", { student, user, notActive });
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
    if (isMobile) return res.status(200).send(data);
    if (user && user.type == "Student") {
      return res.render("student/registration", { data, user, notActive });
    }
    return res.send("Page not found");
  } catch (error) {
    return res.send(error.message);
  }
};

// Schedule Page
const schedule = async (req, res, next) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");

    var scheduleID;
    if (user) {
      scheduleID = user.schedule;
    } else {
      const { userID } = req.query;
      const student = await User.findById(userID);
      scheduleID = student.schedule;
    }
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
    if (isMobile) {
      return res.status(200).send(scheduleList);
    }
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
      notActive,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
// Transcript Page
const transcript = async (req, res, next) => {
  try {
    const isMobile = req.header("Accept").includes("application/json");
    var studentID;
    if (user) {
      studentID = user._id;
    } else {
      const { userID } = req.query;
      const student = await User.findById(userID);
      studentID = student._id;
    }
    const transcript = await Transcript.findOne({ owner: studentID }).populate({
      path: "subjects.subject",
    });
    if (isMobile) {
      const data = [...transcript.subjects];
      return res.status(200).send(data);
    }
    return res.render("student/transcript", {
      transcript: transcript.subjects,
      user,
      notActive,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { currentPass, password } = req.body;
    const isMobile = req.header("Accept").includes("application/json");
    var studentID, passwordUser, img;
    const file = req.file;
    if (user) {
      studentID = user._id;
      passwordUser = user.password;
    } else {
      studentID = req.query.studentID;
      user = await User.findById(studentID);
      passwordUser = user.password;
    }
    if (file) {
      if (user.img) {
        fs.unlink("src/public/uploads/avatar/" + user.img, (err, data) => {
          if (err) console.log(err);
        });
      }
      img = file.filename;
    } else {
      img = user.img;
    }

    const student = await User.findById(studentID);
    const checkPass = await bcrypt.compare(currentPass, passwordUser);
    if (checkPass) {
      const salt = await bcrypt.genSalt(10);
      const passHashed = await bcrypt.hash(password, salt);
      student.password = passHashed;
      student.img = img;
      await student.save();
      if (isMobile) {
        user = null;
        return res
          .status(200)
          .send("Your password has been changed successfully!");
      }

      return res.redirect("/student/profile");
    }
    if (isMobile)
      return res
        .status(201)
        .send(
          "Your password is not correctly, if you forget your password, please contact to admin"
        );
    return res.send(
      "Your password is not correctly, if you forget your password, please contact to admin"
    );
  } catch (error) {
    return res.send(error.message);
  }
};
module.exports = {
  addSubject,
  getEmail,
  getListEmail,
  getNews,
  home,
  profile,
  registration,
  schedule,
  transcript,
  updateProfile,
};
