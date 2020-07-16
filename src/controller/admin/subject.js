const Subject = require("../../model/Subject");

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
      const page = parseInt(req.query.page) || 1;
      const name = req.query.name || '';
      const data = [... await Subject.find({ name: {$regex: new RegExp(name), $options: 'i'}}).sort("subjectID")];
      const subjectsAll = [... await Subject.find({})];
      const subjectName = [];
      subjectsAll.forEach(item=> subjectName.push(item.name));
      const perPage =  5 ;
      const startSlice = (page - 1) * perPage;
      const endSlice = page * perPage;
      const maxPage = Math.ceil(data.length / perPage);
      return res.render("admin/subject", { data: data.slice(startSlice,endSlice) , maxPage,page,subjectName }); 
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
