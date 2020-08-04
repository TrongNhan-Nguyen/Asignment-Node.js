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
    const isMobile = req.header("Accept").includes("application/json");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    req.session.user = user;
    if (user) {
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        if (user.type == "Student") {
          if (isMobile) {
            return res.status(200).send(user);
          };
          return res.redirect("/student");
        }
        if (isMobile) return res.status(201).send({});
        if(user.type=="Admin")return res.redirect("/admin");
        return res.redirect("/admin/news");
      }
      if (isMobile) return res.status(202).send({});
      return res.send("Password incorrect");
    } else {
      if (isMobile) return res.status(201).send({});
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
