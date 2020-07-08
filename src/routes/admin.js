const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const semesterController = require("../controller/semester");
const subjectController = require("../controller/subject");

/*--------GET--------*/
// Admin
router.get("/", adminController.getListAdmin);
// Semester
router.get("/semester", semesterController.getListSemester);
router.get("/semester/formAdd", semesterController.formAdd);
router.get("/semester/:semesterID", semesterController.getListSemester);
router.get("/semester/edit/:semesterID", semesterController.getSemester);
// Student
router.get("/student", adminController.getListStudent);
router.get("/student/edit/:studentID", adminController.getStudent);
router.get("/student/delete/:studentID", adminController.deleteStudent);
router.get("/student/transcript/:transcriptID",adminController.getScript);
router.get("/student/transcript/:transcriptID/:subjectID",adminController.deleteSubjectTranscript);

// Subject
router.get("/subject", subjectController.getListSubject);
router.get("/subject/delete/:subjectID", subjectController.deleteSubject);

/*--------POST--------*/
// Admin
router.post("/add", adminController.createAdmin);
// Semester
router.post("/semester/add", semesterController.createSemester);
router.post("/semester/edit/:semesterID", semesterController.updateSemester);
// Student
router.post("/student/add", adminController.createStudent);
router.post("/student/edit/:studentID", adminController.updateStudent);
router.post("/student/transcript/edit/:transcriptID", adminController.createSubjectTranscript);
router.post("/student/transcript/:transcriptID/:subjectID",adminController.updateSubjectTranscript);

// Subject
router.post("/subject/add", subjectController.createSubject);
router.post("/subject/edit/:subjectID", subjectController.updateSubject);

module.exports = router;
