const express = require("express");
const route = express.Router();
const loginController = require("../controller/admin/login");
const User = require("../model/User");
const Subject = require("../model/Subject");
// Get
route.get("/", loginController.login);
route.get("/logout", loginController.logout);
// Training query
route.get("/query", async (req, res) => {
  try {
    const { name } = req.query;
    const subjects = await Subject.find({ name: {$regex: new RegExp(name), $options: 'i'}});
    return res.send(subjects);
  } catch (error) {
    return res.send(error);
  }
});
// Post
route.post("/login", loginController.getUser);
module.exports = route;
