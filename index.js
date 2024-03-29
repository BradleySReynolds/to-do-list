// Initialize a variable to hold the current todo item's ID
let idHold = 0;

// Define the Projects class
class Projects {
  constructor(name, list) {
    this.name = name;
    this.list = list;
  }

  // Build and format the due date for a todo item
  buildDate = (input) => {
    let dateObj = new Date(input);
    // Calculate the next day date
    let nextDay = new Date((dateObj.getTime() / 1000 + 86400) * 1000);
    dateObj.setDate(dateObj.getDate());

    let day = nextDay.getDate();
    let month = nextDay.getMonth() + 1;

    // Return formatted due date or "No Due Date"
    return input ? `${month}/${Number(day)}` : "No Due Date";
  };

  // Create a new todo item
  createTodo = () => {
    let dueIpt = document.querySelector(".date-ipt").value;
    let titleIpt = document.querySelector(".title-ipt").value;

    // Push a new Todo instance into the list array
    this.list.push(new Todo(titleIpt, this.buildDate(dueIpt)));

    // Clear input fields after adding a todo
    document.querySelector(".date-ipt").value = "";
    document.querySelector(".title-ipt").value = "";
  };

  // Remove a todo item from the list
  removeTodo = (id) => {
    // Find the todo item by its ID and remove it from the list
    this.list.forEach((element, i) => {
      if (element.id === id) {
        this.list = this.list.slice(0, i).concat(this.list.slice(i + 1));
        return 1;
      }
    });
  };

  // Set the current project to this instance
  setCurrent = () => {
    currentProject = this;
  };

  // Add the current project to the projects list
  addToList = () => {
    projectsList.push(this);
  };

  // Edit the details of a todo item
  editTodo = (newTitle, newDue, id) => {
    // Find the todo item by its ID and update its title and due date
    this.list.forEach((element) => {
      if (element.id === id) {
        element.title = newTitle;
        element.due = newDue;
      }
    });
  };

  // Remove a project from the projects list
  removeProject = (nameRm) => {
    projectsList.forEach((element, i) => {
      console.log(element.name, nameRm);
      if (element.name.toLowerCase() === nameRm && element.name !== "Home") {
        console.log(element.name, nameRm);
        // Remove the project from the projects list
        projectsList = projectsList
          .slice(0, i)
          .concat(projectsList.slice(i + 1));
        return 1;
      }
      // Set the current project to the first project after removal
      currentProject = projectsList[0];
    });
  };
}

// Initialize the projectsList variable
let projectsList;

// Load saved projects from local storage or create a new project list
const savedProjects = JSON.parse(localStorage.getItem("projects"));
savedProjects
  ? (projectsList = savedProjects.map(
      (element) => new Projects(element.name, element.list)
    ))
  : (projectsList = [new Projects("Home", [])]);

// Set the current project to the first project in the list
currentProject = projectsList[0];

// Define the Todo class
class Todo {
  constructor(title, due) {
    this.id = Math.floor(Math.random() * 10000);
    this.title = title;
    this.due = due;
    this.check = false;
  }
}

// Select DOM elements for various interactions
const addTask = document.querySelector(".add-task");
const add = document.querySelector(".add");
const editAdd = document.querySelector(".edit-add");
const editCancel = document.querySelector(".edit-cancel");
const cancel = document.querySelector(".cancel");
const itemContainer = document.querySelector(".item-container");
const addProject = document.querySelector(".add-project");
const projectsCon = document.querySelector(".projects-list");
const projectModal = document.querySelector(".new-project-modal");
const addTaskModal = document.querySelector(".new-task-modal");
const editTaskModal = document.querySelector(".edit-task-modal");
const tasksHead = document.querySelector(".item-head");

// Define a class for rendering and managing DOM elements
class DOMrendering {
  // Method to clear the content of a DOM element
  clearDOM = (element) => {
    element.innerHTML = "";
  };

  // Method to create delete buttons for todo items
  createDeleteBtns = () => {
    document.querySelectorAll(".delete").forEach((ele) =>
      ele.addEventListener("click", (e) => {
        e.stopPropagation();
        // Hide the edit task modal and remove the selected todo item
        editTaskModal.style.display = "none";
        currentProject.removeTodo(
          Number(e.target.closest(".item").getAttribute("value"))
        );
        // Re-render the todo list
        this.renderTodoList();
      })
    );
  };

  // Method to render the todo list based on current project's list
  renderTodoList = () => {
    this.clearDOM(itemContainer);

    // Iterate through the current project's list to render todo items
    currentProject.list.forEach((ele) => {
      itemContainer.insertAdjacentHTML(
        "beforeend",
        // Create the HTML structure for each todo item
        `
      <div class="item" value="${ele.id}">
        <div class="name-and-box">
          <input class="check-ipt" type="checkbox" ${
            ele.check ? "checked" : ""
          }/>
          <p class="name">${ele.title}</p>
        </div>
        <div class="details-and-functions">
          <p class="due">${ele.due}</p>
          <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>`
      );
    });
    // Create delete buttons, checkbox interactions, and edit functionality
    this.createDeleteBtns();
    this.addCheck();
    this.editTodoDOM();

    // Store the updated projectsList in local storage
    localStorage.setItem("projects", JSON.stringify(projectsList));
  };

  // Method to handle edit functionality for todo items
  editTodoDOM = () => {
    document.querySelectorAll(".item").forEach((element) => {
      element.addEventListener("click", (e) => {
        // Show the edit task modal and store the ID of the clicked todo item
        editTaskModal.style.display = "flex";
        idHold = Number(e.target.getAttribute("value"));
      });
    });
  };

  // Method to render the projects in the projects list
  renderProjects = () => {
    // Clear the projects container
    this.clearDOM(projectsCon);

    // Iterate through the projectsList and create project items
    projectsList.forEach((element) => {
      projectsCon.insertAdjacentHTML(
        "beforeend",
        // Create the HTML structure for each project item
        `<div class="project-item" value="${element.name.toLowerCase()}">${
          element.name
        }<button class="remove-project">X</button></div>`
      );
    });

    // Create project buttons for interaction
    this.createProjectBtns();
    // Create project delete buttons for removing projects
    this.createProjectDeleteBtns();
  };

  // Method to create event listeners for project delete buttons
  createProjectDeleteBtns = () => {
    document.querySelectorAll(".remove-project").forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        // Remove the project and reassign currentProject
        currentProject.removeProject(
          e.target.closest("div").getAttribute("value")
        );
        currentProject = projectsList[0];
        // Re-render projects and todo list
        this.renderProjects();
        this.renderTodoList();
        tasksHead.textContent = `Tasks for ${currentProject.name}`;
      });
    });
  };

  // Method to create event listeners for project selection buttons
  createProjectBtns = () => {
    document.querySelectorAll(".project-item").forEach((element) => {
      element.addEventListener("click", (e) => {
        // Set the currentProject based on the selected project
        currentProject =
          projectsList[
            projectsList.indexOf(
              projectsList.find(
                (ele) =>
                  ele.name.toLowerCase() === e.target.getAttribute("value")
              )
            )
          ];
        // Re-render the todo list and update the tasks header
        this.renderTodoList();
        tasksHead.textContent = `Tasks for ${currentProject.name}`;
      });
    });
  };

  // Method to set initial values to an array of elements
  setInitials = (...arr) => {
    // Reset each element to an empty value
    arr.forEach((element) => (element = ""));
  };

  // Method to handle checkbox interaction for todo items
  addCheck = () => {
    document.querySelectorAll(".check-ipt").forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        editTaskModal.style.display = "none";
        // Toggle the check property for the clicked todo item
        currentProject.list.forEach((element) => {
          if (
            element.id ===
            Number(e.target.closest(".item").getAttribute("value"))
          ) {
            element.check ? (element.check = false) : (element.check = true);

            // Re-render the todo list
            this.renderTodoList();
          }
        });
      });
    });
  };
}

// Create an instance of the DOMrendering class to handle DOM manipulation
const renderDOM = new DOMrendering();

// Event listener for "Add Task" button click to open the new task modal
addTask.addEventListener("click", () => {
  addTaskModal.style.display = "flex";
});

// Event listener for "Add" button click in the new task modal
add.addEventListener("click", () => {
  // Hide the new task modal
  addTaskModal.style.display = "none";
  // Create a new todo and render the updated todo list
  currentProject.createTodo();
  renderDOM.renderTodoList();
});

// Event listener for "Edit Add" button click in the edit task modal
editAdd.addEventListener("click", (e) => {
  // Get values from input fields
  let editTitle = document.querySelector(".edit-title-ipt").value;
  let editDue = document.querySelector(".edit-date-ipt").value;
  // Hide the edit task modal
  editTaskModal.style.display = "none";
  // Edit the selected todo and render the updated todo list
  currentProject.editTodo(editTitle, currentProject.buildDate(editDue), idHold);
  renderDOM.renderTodoList();
});

// Event listener for "Cancel" button click in the new task modal
cancel.addEventListener("click", () => {
  addTaskModal.style.display = "none";
});

// Event listener for "Edit Cancel" button click in the edit task modal
editCancel.addEventListener("click", () => {
  editTaskModal.style.display = "none";
});

// Event listener for "Add Project" button click to create a new project
addProject.addEventListener("click", () => {
  let newProject;
  // Prompt user for project name (Max 12 characters)
  let projectIpt = prompt("Project Name (Max 12 Characters)").substring(0, 12);
  // If user provides a name, create a new project and render projects and todo list
  if (projectIpt) {
    newProject = new Projects(projectIpt, []);
    newProject.addToList();
    newProject.setCurrent();
  }
  renderDOM.renderProjects();
  renderDOM.renderTodoList();
  tasksHead.textContent = `Tasks for ${currentProject.name}`;
});

// Initial rendering of projects and todo list
renderDOM.renderProjects();
renderDOM.renderTodoList();
