const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "pending" 
  },
  // Tracks who created the task
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  // Array to support multiple team members
  assignedTo: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  comments: [
    {
      text: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Track who commented
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);