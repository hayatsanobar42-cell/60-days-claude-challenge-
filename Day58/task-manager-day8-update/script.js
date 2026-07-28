// Task Manager - script.js
// Day 8: Testing, Debugging & Production Optimization
// Core features unchanged from Day 7 (add / complete / delete / persist / summary).
// This pass hardens the app for production: safer ID generation, input/data
// validation, race-condition fix on delete, user-visible storage error
// feedback, and placeholder reset after validation errors.

const STORAGE_KEY = "tasks";
const MAX_TASK_LENGTH = 200;

// Grab references to the HTML elements we need
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskSummary = document.getElementById("task-summary");
const formError = document.getElementById("form-error");
const storageWarning = document.getElementById("storage-warning");

const DEFAULT_PLACEHOLDER = "Enter a new task...";

// Generates a reasonably unique ID. Prefers crypto.randomUUID() (supported in
// all modern browsers); falls back to a timestamp + random suffix for older
// browsers so IDs never collide even if two tasks are added in the same tick.
function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Validates that a raw object from localStorage looks like a real task.
// Filters out corrupted/malformed entries instead of crashing the render.
function isValidTask(task) {
  return (
    task &&
    typeof task === "object" &&
    typeof task.id === "string" &&
    task.id.length > 0 &&
    typeof task.text === "string" &&
    task.text.trim().length > 0 &&
    typeof task.completed === "boolean"
  );
}

// Loads tasks from localStorage. Returns an empty array if nothing is saved,
// if the saved data is corrupted, or if individual entries are malformed.
function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask);
  } catch (error) {
    console.error("Failed to read tasks from localStorage:", error);
    return [];
  }
}

// Saves the given tasks array to localStorage. Returns true on success,
// false on failure (e.g. storage disabled, quota exceeded, private mode).
function saveTasks(tasksToSave) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    hideStorageWarning();
    return true;
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
    showStorageWarning();
    return false;
  }
}

function showStorageWarning() {
  if (!storageWarning) return;
  storageWarning.textContent =
    "⚠ Your changes couldn't be saved. Your browser's storage may be full or disabled (e.g. private browsing).";
  storageWarning.style.display = "block";
}

function hideStorageWarning() {
  if (!storageWarning) return;
  storageWarning.style.display = "none";
  storageWarning.textContent = "";
}

// In-memory copy of tasks, loaded from localStorage on startup
let tasks = getTasks();

// Tracks whether a delete animation is already in progress for a given task
// id, to prevent double-delete race conditions from rapid double-clicks.
const deletingIds = new Set();

// Creates a new task object, adds it to the array, saves, and re-renders
function addTask(text) {
  const trimmed = text.trim().slice(0, MAX_TASK_LENGTH);
  if (trimmed === "") return;

  const newTask = {
    id: generateId(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
}

// Flips a task's completed status by id, saves, and re-renders
function toggleTaskComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
  }
}

// Removes a task from the array by id, saves, and re-renders.
// Guards against double-delete race conditions: if a delete animation is
// already running for this id, subsequent clicks are ignored.
function deleteTask(id) {
  if (deletingIds.has(id)) return;

  const li = taskList.querySelector(`li[data-id="${CSS.escape(id)}"]`);

  if (li) {
    deletingIds.add(id);

    const deleteBtn = li.querySelector(".delete-btn");
    const checkbox = li.querySelector(".task-checkbox");
    if (deleteBtn) deleteBtn.disabled = true;
    if (checkbox) checkbox.disabled = true;

    li.classList.add("removing");

    let removed = false;
    const finishRemoval = () => {
      if (removed) return;
      removed = true;
      deletingIds.delete(id);
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks(tasks);
      renderTasks();
    };

    li.addEventListener("transitionend", finishRemoval, { once: true });
    // Safety net: if the transitionend event never fires for any reason
    // (e.g. reduced-motion environments with near-zero durations that some
    // browsers skip), force removal after a short timeout so the UI never
    // gets stuck with a task the user tried to delete.
    setTimeout(finishRemoval, 500);
  } else {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);
    renderTasks();
  }
}

// Updates the small "X of Y tasks completed" summary line above the list
function renderSummary() {
  if (!taskSummary) return;

  if (tasks.length === 0) {
    taskSummary.textContent = "";
    taskSummary.style.display = "none";
    return;
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  taskSummary.style.display = "block";
  taskSummary.textContent = `${completedCount} of ${tasks.length} task${
    tasks.length === 1 ? "" : "s"
  } completed`;
}

// Clears the task list in the DOM and rebuilds it from the tasks array
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    renderSummary();
    return;
  }

  emptyMessage.style.display = "none";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task complete: " + task.text);
    checkbox.addEventListener("change", () => toggleTaskComplete(task.id));

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", "Delete task: " + task.text);
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  renderSummary();
}

// Shows a brief validation error under the form and shakes the input.
// Automatically clears itself after a short delay, restoring the original
// placeholder text (fixes Day 7 bug where placeholder stayed changed forever).
let errorClearTimeout = null;
function showFormError(message) {
  taskInput.classList.add("input-error");
  taskInput.setAttribute("aria-invalid", "true");

  if (formError) {
    formError.textContent = message;
    formError.style.display = "block";
  }

  clearTimeout(errorClearTimeout);
  errorClearTimeout = setTimeout(() => {
    taskInput.classList.remove("input-error");
    taskInput.removeAttribute("aria-invalid");
    if (formError) {
      formError.style.display = "none";
      formError.textContent = "";
    }
  }, 2200);
}

// Handle form submission (clicking "Add" or pressing Enter)
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    showFormError("Please type a task before adding it.");
    return;
  }

  if (text.length > MAX_TASK_LENGTH) {
    showFormError(`Tasks must be ${MAX_TASK_LENGTH} characters or fewer.`);
    return;
  }

  addTask(text);
  taskInput.value = "";
  taskInput.setAttribute("placeholder", DEFAULT_PLACEHOLDER);
  taskInput.focus();
});

// Clear any lingering error state as soon as the user starts fixing it
taskInput.addEventListener("input", () => {
  if (taskInput.classList.contains("input-error") && taskInput.value.trim() !== "") {
    taskInput.classList.remove("input-error");
    taskInput.removeAttribute("aria-invalid");
    if (formError) {
      formError.style.display = "none";
      formError.textContent = "";
    }
    clearTimeout(errorClearTimeout);
  }
});

// Initial render on page load - shows whatever was loaded from localStorage
renderTasks();
