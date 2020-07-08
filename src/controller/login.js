const User = require("../model/User");
const e = require("express");

const login = async (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    res.send(error.message);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { email, pass } = req.body;
    const data = await User.find({ type: "Student" });
    const user = await User.findOne({email});
    req.session.user = user;
    if (user) {
        if(user.password === pass) {
            if(user.type === "Student"){
                return res.redirect("/student");
            }
            return res.redirect("/admin")
        }; 
        return res.send("Password incorrect")

    } else {
      return res.send("User not found, please try again!");
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  login,
  getUser,
};
