const express = require('express');
const route = express.Router();
const studentController = require("../controller/student");

route.get("/",studentController.home);


module.exports = route;