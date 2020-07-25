// Get list semester;
const Subject = require("../../model/Subject");
const Semester = require("../../model/Semester");
var user;
const createSemester = async (req, res, next) => {
  try {
    const { name, subjects } = req.body;
    const arraySubject = subjects.split(",");
    const semester = new Semester({ name, subjects: arraySubject });
    await semester.save();
    res.redirect("/admin/semester/formAdd");
  } catch (err) {
    res.send(err.message);
  }
};
const formAdd = async (req, res, next) => {
  try {
    const subjects = await Subject.find({}).sort("name");
    res.render("admin/add_semester", { subjects,user });
  } catch (err) {
    res.send(err.message);
  }
};
const getListSemester = async (req, res, next) => {
  try {
    const semesters = await Semester.find({}).sort("name");
    const { semesterID } = req.params;
    user = req.session.user;
    if( user && (user.type==="Admin" || user.type==="Lecturer")){
      if (semesterID) {
        const semester = await Semester.findById(semesterID).populate("subjects");
        return res.render("admin/semester", { semesters, semester,user });
      } 
       return res.render("admin/semester", { semesters,user });
    
    }
    return res.send("Page not found")
    
  } catch (err) {
    res.send(err.message);
  }
};

const getSemester = async (req, res, next) => {
  try {
    const { semesterID } = req.params;
    const subjects = await Subject.find({}).sort("name");
    const semester = await Semester.findById(semesterID).populate("subjects");
    res.render("admin/edit_semester", { semester, subjects,user });
  } catch (err) {
    res.send(err.message);
  }
};
const updateSemester = async (req, res, next) => {
  try {
    const { name, subjects } = req.body;
    const { semesterID } = req.params;
    const arraySubject = subjects.split(",");
    const semesterUpdate = { name, subjects: arraySubject };
    const semester = await Semester.findById(semesterID);
    await semester.set({subjects:[]}).save();
    await Semester.findByIdAndUpdate(semesterID, semesterUpdate);
    res.redirect("/admin/semester/"+semesterID);
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  createSemester,
  formAdd,
  getListSemester,
  getSemester,
  updateSemester,
};
