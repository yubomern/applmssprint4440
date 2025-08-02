const { Router } = require("express");
const {
  getToDo,
  saveToDo,
  deleteToDo,
  updateToDo,
} = require("../controllers/ToDoController");

const router = Router();
const ToDoModel = require("../models/ToDoModel");

router.route("/").get(getToDo).post(saveToDo).put(updateToDo);

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  console.log("id ---> ", req.body.data);

  ToDoModel.findByIdAndDelete(id)
    .then(() => res.set(201).send("Deleted Successfully..."))
    .catch((err) => console.log(err));
});

module.exports = router;
