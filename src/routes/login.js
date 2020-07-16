const express = require("express");
const route = express.Router();
const loginController = require("../controller/admin/login");
const User = require("../model/User");
const Subject = require("../model/Subject");
// Get
route.get("/", loginController.login);
route.get("/logout", loginController.logout);
// Post
route.post("/login", loginController.getUser);
module.exports = route;
