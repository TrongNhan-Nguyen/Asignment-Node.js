const express = require('express');
const route = express.Router();
const studentController = require("../controller/student/student");
const multer = require("multer");
const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/public/uploads/avatar");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
const avatar = multer({ storage: storageAvatar });

/*--------GET--------*/
route.get("/",studentController.home);
route.get("/email", studentController.getListEmail);
route.get("/email/:emailID", studentController.getEmail);
route.get("/news/:newsID",studentController.getNews);
route.get("/profile",studentController.profile);
route.get("/registration",studentController.registration);
route.get("/schedule",studentController.schedule);
route.get("/transcript",studentController.transcript);
/*--------POST--------*/
// Change profile
route.post("/profile",avatar.single("avatar"),studentController.updateProfile);

// Course registration;
route.post("/registration",studentController.addSubject);
module.exports = route;