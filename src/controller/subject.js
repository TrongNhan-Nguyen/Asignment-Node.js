const Subject = require("../model/Subject");
const { use } = require("../routes/login");

// Create subject
const createSubject = async (req, res, next) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.redirect("/admin/subject");
  } catch (err) {
    res.send(err.message);
  }
};
const deleteSubject = async (req, res, next) => {
  try {
    const { subjectID } = req.params;
    const { currentPage } = req.query;
    await Subject.findByIdAndDelete(subjectID);
    res.redirect("/admin/subject?page=" + currentPage);
  } catch (err) {
    res.send(err.message);
  }
};

// Get list subject
const getListSubject = async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user && user.type === "Admin") {
      console.log(user);
      const page = parseInt(req.query.page);
      const query = parseInt(req.query.page) || 0;
      await Subject.find({})
        .sort("subjectID")
        .limit(5)
        .skip(5 * page)
        .exec((err, data) => {
          if (err) {
            return res.send(err.message);
          }
          return res.render("admin/subject", { data, query });
        });
    } else {
      res.send("Page not found");
    }
  } catch (err) {
    res.send(err.message);
  }
};
// Update subject
const updateSubject = async (req, res, next) => {
  try {
    const { subjectID } = req.params;
    const { currentPage } = req.query;
    const subject = req.body;
    await Subject.findByIdAndUpdate(subjectID, subject);
    res.redirect("/admin/subject?page=" + currentPage);
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = {
  createSubject,
  deleteSubject,
  getListSubject,
  updateSubject,
};
