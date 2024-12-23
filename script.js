// Ensure this script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const Input = document.querySelector(".InputAndButton #task");
  const taskList = document.getElementById("taskList");

  if (!Input || !taskList) {
    console.error("Required elements are missing from the DOM");
    return;
  }

  const addTask = (taskName, isComplete, updateStorage = true) => {
    const valueInput = taskName || Input.value.trim();
    if (!valueInput) {
      alert("You Must Enter a Task Name");
      return;
    }

    const existingTasks = Array.from(taskList.querySelectorAll("div"));
    for (const task of existingTasks) {
      if (task.textContent === valueInput) {
        alert("Task Name Already Exists");
        return;
      }
    }

    const li = document.createElement("li");
    const div = document.createElement("div");
    const closeButton = document.createElement("span");

    div.textContent = valueInput;
    closeButton.innerHTML = "\u00d7";

    li.appendChild(div);
    li.appendChild(closeButton);

    if (isComplete) {
      li.classList.add("completed");
    }

    taskList.appendChild(li);

    if (updateStorage) updateLocalStorage();

    Input.value = "";
  };

  let debounceTimer;
  const updateLocalStorage = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const tasks = Array.from(taskList.children).map((task) => ({
        text: task.querySelector("div").textContent,
        isComplete: task.classList.contains("completed"),
      }));
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, 300);
  };

  const restoreTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach((task) => addTask(task.text, task.isComplete, false));
  };

  restoreTasks();

  // Attach the click event listener
  document.getElementById("addTask").addEventListener("click", () => {
    addTask();
  });

  taskList.addEventListener("click", (event) => {
    if (
      event.target.tagName === "SPAN" &&
      event.target.textContent === "\u00d7"
    ) {
      event.target.parentNode.remove();
      updateLocalStorage();
    } else if (event.target.tagName === "DIV") {
      const parentTask = event.target.closest("li");
      if (parentTask) {
        parentTask.classList.toggle("completed");
        updateLocalStorage();
      }
    }
  });
});
