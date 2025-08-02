const express = require("express");
const {
    getCourses,
    getCourse_st,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
  
} = require("../controllers/lectureController");

const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const { upload } = require("../helper/filehelper");

//require auth for all workout routes
router.use(requireAuth);

//GET all chapters
router.get("/", getCourses);

//GET all chapters studnet
router.get("/st", getCourse_st);

//GET a single chapters
router.get("/:id", getCourse);

//POST A NEW chapters || using req u can access data
router.post("/", upload.single("img"), createCourse);

//Delete a  chapter
router.delete("/:id", deleteCourse);

//Update a chapter
router.patch("/:id", updateCourse);

module.exports = router;
