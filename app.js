const apiUrl = "http://localhost:8080/api/tasks";

document.addEventListener("DOMContentLoaded", () => {
  fetchTasks();

  document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();
    if (task) {
      createTask(task);
      taskInput.value = "";
    }
  });
});

function fetchTasks() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((tasks) => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      tasks.forEach(addTaskToDOM);
    });
}

function addTaskToDOM(task) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");
  li.textContent = task.description;
  li.className = task.completed ? "completed" : "";

  // Toggle complete
  li.addEventListener("click", () => toggleTask(task));

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  li.appendChild(delBtn);
  list.appendChild(li);
}

function createTask(description) {
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, completed: false }),
  }).then(fetchTasks);
}

function toggleTask(task) {
  fetch(`${apiUrl}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: task.description,
      completed: !task.completed,
    }),
  }).then(fetchTasks);
}

function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  }).then(fetchTasks);
}
