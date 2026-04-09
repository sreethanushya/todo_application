const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

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
   🌐 SERVE FRONTEND
========================= */

// Serve frontend build folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route (for demo or if frontend is missing)
app.get('/', (req, res) => {
  const indexFile = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexFile, err => {
    if (err) {
      res.send('🟢 Todo App Backend is live! Frontend not built yet.');
    }
  });
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
