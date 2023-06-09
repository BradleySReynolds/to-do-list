let idHold = 0;

class Projects {
  constructor(name, list) {
    this.name = name;
    this.list = list;
  }

  buildDate = (input) => {
    let dateObj = new Date(input);
    let nextDay = new Date((dateObj.getTime() / 1000 + 86400) * 1000);
    dateObj.setDate(dateObj.getDate());

    let day = nextDay.getDate();
    let month = nextDay.getMonth() + 1;

    return input ? `${month}/${Number(day)}` : "No Due Date";
  };

  createTodo = () => {
    let dueIpt = document.querySelector(".date-ipt").value;
    let titleIpt = document.querySelector(".title-ipt").value;

    this.list.push(new Todo(titleIpt, this.buildDate(dueIpt)));

    document.querySelector(".date-ipt").value = "";
    document.querySelector(".title-ipt").value = "";
  };

  removeTodo = (id) => {
    this.list.forEach((element, i) => {
      if (element.id === id) {
        this.list = this.list.slice(0, i).concat(this.list.slice(i + 1));
        return 1;
      }
    });
  };

  setCurrent = () => {
    currentProject = this;
  };

  addToList = () => {
    projectsList.push(this);
  };

  editTodo = (newTitle, newDue, id) => {
    this.list.forEach((element) => {
      if (element.id === id) {
        element.title = newTitle;
        element.due = newDue;
      }
    });
  };

  removeProject = (nameRm) => {
    projectsList.forEach((element, i) => {
      console.log(element.name, nameRm)
      if (element.name.toLowerCase() === nameRm && element.name !== "Home") {
        console.log(element.name, nameRm)
        projectsList = projectsList.slice(0, i).concat(projectsList.slice(i + 1));
        return 1;
      }
      currentProject = projectsList[0]
    })
  }
}
let projectsList;

const savedProjects = JSON.parse(localStorage.getItem("projects"));
savedProjects
  ? (projectsList = savedProjects.map(
      (element) => new Projects(element.name, element.list)
    ))
  : (projectsList = [new Projects("Home", [])]);

currentProject = projectsList[0];

class Todo {
  constructor(title, due) {
    this.id = Math.floor(Math.random() * 10000);
    this.title = title;
    this.due = due;
    this.check = false
  }
}

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
const tasksHead = document.querySelector('.item-head')

class DOMrendering {
  clearDOM = (element) => {
    element.innerHTML = "";
  };

  createDeleteBtns = () => {
    document.querySelectorAll(".delete").forEach((ele) =>
      ele.addEventListener("click", (e) => {
        e.stopPropagation();
        editTaskModal.style.display = "none";
        currentProject.removeTodo(
          Number(e.target.closest(".item").getAttribute("value"))
        );
        this.renderTodoList();
      })
    );
  };

  renderTodoList = () => {
    this.clearDOM(itemContainer);

    currentProject.list.forEach((ele) => {
      itemContainer.insertAdjacentHTML(
        "beforeend",
        `
      <div class="item" value="${ele.id}">
        <div class="name-and-box">
          <input class="check-ipt" type="checkbox" ${ele.check ? 'checked' : ''}/>
          <p class="name">${ele.title}</p>
        </div>
        <div class="details-and-functions">
          <p class="due">${ele.due}</p>
          <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>`
      );
    });
    this.createDeleteBtns();
    this.addCheck()
    this.editTodoDOM();

    localStorage.setItem("projects", JSON.stringify(projectsList));
  };

  editTodoDOM = () => {
    document.querySelectorAll(".item").forEach((element) => {
      element.addEventListener("click", (e) => {
        editTaskModal.style.display = "flex";
        idHold = Number(e.target.getAttribute("value"));
      });
    });
  };

  renderProjects = () => {
    this.clearDOM(projectsCon);

    projectsList.forEach((element) => {
      projectsCon.insertAdjacentHTML(
        "beforeend",
        `<div class="project-item" value="${element.name.toLowerCase()}">${
          element.name
        }<button class="remove-project">X</button></div>`
      );
    });

    this.createProjectBtns();
    this.createProjectDeleteBtns()
  };

  createProjectDeleteBtns = () => {
    document.querySelectorAll('.remove-project').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation()
        currentProject.removeProject(e.target.closest('div').getAttribute('value'))
        currentProject = projectsList[0]
        this.renderProjects()
        this.renderTodoList()
        tasksHead.textContent = `Tasks for ${currentProject.name}`
      })
    })
  }

  createProjectBtns = () => {
    document.querySelectorAll(".project-item").forEach((element) => {
      element.addEventListener("click", (e) => {
        currentProject =
          projectsList[
            projectsList.indexOf(
              projectsList.find(
                (ele) =>
                  ele.name.toLowerCase() === e.target.getAttribute("value")
              )
            )
          ];
        this.renderTodoList();
        tasksHead.textContent = `Tasks for ${currentProject.name}`
      });
    });
  };

  setInitials = (...arr) => {
    arr.forEach((element) => (element = ""));
  };

  addCheck = () => {
    document.querySelectorAll('.check-ipt').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        editTaskModal.style.display = "none";
        currentProject.list.forEach((element) => {
          if (element.id === Number(e.target.closest('.item').getAttribute('value'))) {
            element.check ? element.check = false : element.check = true

            this.renderTodoList()
          }
        });
      })
    })
  }
}

const renderDOM = new DOMrendering();

addTask.addEventListener("click", () => {
  addTaskModal.style.display = "flex";
});

add.addEventListener("click", () => {
  addTaskModal.style.display = "none";
  currentProject.createTodo();
  renderDOM.renderTodoList();
});

editAdd.addEventListener("click", (e) => {
  let editTitle = document.querySelector(".edit-title-ipt").value;
  let editDue = document.querySelector(".edit-date-ipt").value;
  editTaskModal.style.display = "none";
  currentProject.editTodo(editTitle, currentProject.buildDate(editDue), idHold);
  renderDOM.renderTodoList();
});

cancel.addEventListener("click", () => {
  addTaskModal.style.display = "none";
});

editCancel.addEventListener("click", () => {
  editTaskModal.style.display = "none";
});

addProject.addEventListener("click", () => {
  let newProject;
  let projectIpt = prompt("Project Name (Max 12 Characters)").substring(0, 12);
  projectIpt
    ? ((newProject = new Projects(projectIpt, [])),
      newProject.addToList(),
      newProject.setCurrent())
    : false;

  renderDOM.renderProjects();
  renderDOM.renderTodoList();
  tasksHead.textContent = `Tasks for ${currentProject.name}`
});

renderDOM.renderProjects();
renderDOM.renderTodoList();

