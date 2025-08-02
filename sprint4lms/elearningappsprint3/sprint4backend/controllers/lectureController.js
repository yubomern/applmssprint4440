const Course = require("../models/coursesModel");
const mongoose = require("mongoose");
const cloudinary = require("../helper/cloudinary");

// get all Courses
const getCourses = async (req, res) => {
  try {
    const user_id = req.user._id;
    const chapters = await Course.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(chapters);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

//get all Courses student
const getCourse_st = async (req, res) => {
  try {
    const chapters = await Course.find({});
    res.status(200).json(chapters);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

//get a single chapters
const getCourse = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such id" });
    }

    const chapters = await Course.findById(id);

    if (!chapters) {
      return res.status(404).json({ error: "no such workout" });
    }
    res.status(200).json(chapters);
  } catch (err) {
    res.status(400).json(err);
  }
};

//create new chapters
const createCourse = async (req, res) => {
  const  {title , description ,  category , matiere  }= req.body;
  console.log(req.user);
  try {
    const user_id = req.user._id;
    if (req.file !== undefined) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${title}_Course`,
      });
      const img = result.url;
      const chapters_img = await Course.create({ title,  description , category ,matiere, img, user_id });
      res.status(200).json(chapters_img);
    } else {
      const chapter = await Course.create({ title, description , category ,matiere,  user_id });
      res.status(200).json(chapter);
    }
  } catch (err) {
    console.log(err);
  }
};

//update a  courses 

const updateCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such id" });
  }

  const chapters = await Course.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!chapters) {
    return res.status(404).json({ error: "no such workout" });
  }

  res.status(200).json(chapters);
};

//delete a Course

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const public_id = `${req.body.title}_Course`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such id" });
    }
    const result = await cloudinary.uploader
      .destroy(public_id)
      .then((result) => console.log(result));
    const chapters = await Course.findByIdAndDelete({ _id: id });

    console.log(result);
    if (!chapters) {
      return res.status(404).json({ error: "no such workout" });
    }

    res.status(200).json(chapters);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getCourses,
  getCourse_st,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
};
