const express = require('express');
const route = express.Router();
const studentController = require("../controller/student/student");

route.get("/",studentController.home);


module.exports = route;