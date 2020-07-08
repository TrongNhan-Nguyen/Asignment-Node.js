const express = require('express');
const route = express.Router();
const loginController = require("../controller/login");
const adminController  = require("../controller/admin");
// Get
route.get("/",loginController.login);
// Post
route.post("/",loginController.getUser);
module.exports = route;