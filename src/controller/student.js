var isStudent;
const home = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user && user.type === "Student") {
      return res.render("student/home");
    }
    return res.send("Page not found");
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  home,
};
