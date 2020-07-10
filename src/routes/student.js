const express = require('express');
const route = express.Router();
const studentController = require("../controller/student/student");
/*--------GET--------*/
// Home Page
route.get("/",studentController.home);
// News
route.get("/news/:newsID",studentController.getNews);
// Transcript
route.get("/transcript",studentController.getTranscript);
// Student
route.get("/profile",studentController.getProfile);
/*--------POST--------*/
route.post("/profile",studentController.changePassword);
module.exports = route;