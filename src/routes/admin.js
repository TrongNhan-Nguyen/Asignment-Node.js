const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/admin");
const semesterController = require("../controller/admin/semester");
const subjectController = require("../controller/admin/subject");
const newsController = require("../controller/admin/news");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

/*--------GET--------*/
// Admin
router.get("/", adminController.getListAdmin);
// News
router.get("/news", newsController.getNewsList);
router.get("/news/add", newsController.formAdd);
router.get("/news/edit/:newsID", newsController.editNews);
router.get("/news/delete/:newsID", newsController.deleteNews);
// Semester
router.get("/semester", semesterController.getListSemester);
router.get("/semester/formAdd", semesterController.formAdd);
router.get("/semester/:semesterID", semesterController.getListSemester);
router.get("/semester/edit/:semesterID", semesterController.getSemester);
// Student
router.get("/student", adminController.getListStudent);
router.get("/student/edit/:studentID", adminController.getStudent);
router.get("/student/delete/:studentID", adminController.deleteStudent);
router.get("/student/transcript/:transcriptID", adminController.getScript);
router.get(
  "/student/transcript/:transcriptID/:subjectID",
  adminController.deleteSubjectTranscript
);

// Subject
router.get("/subject", subjectController.getListSubject);
router.get("/subject/delete/:subjectID", subjectController.deleteSubject);

/*--------POST--------*/
// Admin
router.post("/add", adminController.createAdmin);
// News
router.post("/news/add", upload.single("img"), newsController.createNews);
router.post("/news/edit/:newsID", upload.single("img"), newsController.updateNews);
// Semester
router.post("/semester/add", semesterController.createSemester);
router.post("/semester/edit/:semesterID", semesterController.updateSemester);
// Student
router.post("/student/add", adminController.createStudent);
router.post("/student/edit/:studentID", adminController.updateStudent);
router.post(
  "/student/transcript/edit/:transcriptID",
  adminController.createSubjectTranscript
);
router.post(
  "/student/transcript/:transcriptID/:subjectID",
  adminController.updateSubjectTranscript
);

// Subject
router.post("/subject/add", subjectController.createSubject);
router.post("/subject/edit/:subjectID", subjectController.updateSubject);

module.exports = router;
