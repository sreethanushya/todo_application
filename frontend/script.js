const API = "http://51.21.128.240:3000/tasks";

let editId = null;

window.onload = loadTasks;

// LOAD
async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.className = `${task.priority || ''} ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div onclick="toggleTask(${task.id})">
        <b>${task.title}</b><br>
        <small>
          Category: ${task.category || 'N/A'} |
          Priority: ${task.priority || 'N/A'}
        </small>
      </div>

      <div>
        <button onclick="editTask(${task.id}, '${task.title}', '${task.priority}', '${task.category}')">✏️</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// ADD / UPDATE
async function addTask() {
  const title = document.getElementById("taskInput").value;
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category").value;

  if (!title) return alert("Enter task");

  const task = { title, priority, category, completed: false };

  if (editId) {
    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(task)
    });
    editId = null;
  } else {
    await fetch(API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(task)
    });
  }

  clearForm();
  loadTasks();
}

// DELETE
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}

// TOGGLE
async function toggleTask(id) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ completed: true })
  });
  loadTasks();
}

// EDIT
function editTask(id, title, priority, category) {
  document.getElementById("taskInput").value = title;
  document.getElementById("priority").value = priority || "";
  document.getElementById("category").value = category || "";
  editId = id;
}

// CLEAR
function clearForm() {
  document.getElementById("taskInput").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("category").value = "";
}
