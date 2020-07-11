const express = require('express');
const route = express.Router();
const studentController = require("../controller/student/student");
/*--------GET--------*/
route.get("/",studentController.home);
route.get("/news/:newsID",studentController.getNews);
route.get("/profile",studentController.profile);
route.get("/registration",studentController.registration);
route.get("/schedule",studentController.schedule);
route.get("/transcript",studentController.transcript);
/*--------POST--------*/
// Change password
route.post("/profile",studentController.changePassword);
// Course registration;
route.post("/registration",studentController.addSubject);
module.exports = route;