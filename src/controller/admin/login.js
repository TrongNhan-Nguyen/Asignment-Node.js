const User = require("../../model/User");
const bcrypt = require("bcryptjs");

// Login and send session
const login = async (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    res.send(error.message);
  }
};
// Logout and destroy session
const logout = async (req, res, next) => {
  try {
    req.session.destroy();
    return res.redirect("/");
  } catch (error) {
    res.send(error.message);
  }
};
// Determinative user for route
const getUser = async (req, res, next) => {
  try {
    const { email, pass } = req.body;
    const user = await User.findOne({ email });
    req.session.user = user;
    if (user) {
      const checkPass = await bcrypt.compare(pass, user.password);
      if (checkPass) {
        if (user.type === "Student") {
          return res.redirect("/student");
        }
        return res.redirect("/admin");
      }
      return res.send("Password incorrect");
    } else {
      return res.send("User not found, please try again!");
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  login,
  logout,
  getUser,
};
