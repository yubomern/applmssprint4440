const express = require("express");
const {
  createChapters,
  getChapters,
  getChapters_st,
  getchapter,
  deleteChapter,
  updateChapter,
  createModule,
} = require("../controllers/chaptersController");

const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const { upload } = require("../helper/filehelper");

//require auth for all workout routes
router.use(requireAuth);

//GET all chapters
 /**
     * @swagger
     * /users:
     *   get:
     *     summary: Returns a list of users
     *     responses:
     *       200:
     *         description: A list of chapters
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   name:
     *                     type: string
     */
router.get("/", getChapters);

//GET all chapters studnet
router.get("/st", getChapters_st);

//GET a single chapters
router.get("/:id", getchapter);

//POST A NEW chapters || using req u can access data
router.post("/", upload.single("img"), createChapters);

//Delete a  chapter
router.delete("/:id", deleteChapter);

//Update a chapter
router.patch("/:id", updateChapter);

module.exports = router;
