const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth"); // Protects the routes

// 1. CREATE a Task
router.post("/", auth, async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id, // ID from JWT middleware
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 2. READ (Get all tasks for the logged-in user)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 3. UPDATE (Change status or title)
router.put("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Ensure the user owns this task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 4. DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// POST: Add a comment to a specific task
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const newComment = {
      text: req.body.text,
      // createdAt is handled by the default value in your schema
    };

    task.comments.unshift(newComment); // Add to the beginning of the array
    await task.save();
    
    res.json(task.comments); // Return the updated comments list
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// GET a specific task by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;