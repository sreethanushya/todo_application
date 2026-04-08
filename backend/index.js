const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   🔗 CONNECT TO MONGODB
========================= */
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


/* =========================
   📦 TASK SCHEMA
========================= */

const taskSchema = new mongoose.Schema({
  title: String,
  priority: String,
  category: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model("Task", taskSchema);

/* =========================
   📌 API ROUTES
========================= */

// GET all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ADD task
app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// UPDATE task
app.put('/tasks/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* =========================
   🚀 START SERVER
========================= */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});