var taskIdCounter = 0;

const pageContentEl = document.querySelector("#page-content");
const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksCompletedEl = document.querySelector("#tasks-completed");
const alertHolder = document.querySelector("#alertHolder");

var tasks = [];

function alert(message) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                            <div class="ml-2">
                                ${message}
                            </div>
                            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
                         </div>`;
    alertHolder.append(wrapper);
}

function success(message) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-success d-flex align-items-center" role="alert">
                            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                            <div class="ml-2">
                                ${message}
                            </div>
                            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
                         </div>`;
    alertHolder.append(wrapper);
}

const taskFormHandler = function(event) {
    // Prevents the page from reloading when form is submitted
    event.preventDefault();

    // Creates a variable that will be what is typed in the task name field
    const taskNameInput = document.querySelector("input[name='task-name']").value;
    // Creates a variable that will be what is selected as the task type
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Makes sure that Name and Type were filled out
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // Resets the form after each submission
    formEl.reset();

    const isEdit = formEl.hasAttribute("data-task-id");

    // Has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        const taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // No data attribute, so create object as normal and pass to createTaskEl function
    else {
        // Package up data as an object
        const taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        // Send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
}

// Function to create a new task
const createTaskEl = function(taskDataObj) {
    // a new <li> element is created
    const listItemEl = document.createElement("li");
    // it is given the "task-item" class to be styled
    listItemEl.className = "task-item";

    // Add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    // Makes listItemEl draggable
    listItemEl.setAttribute("draggable", "true");

    // Create div to hold task info and add to list item
    const taskInfoEl = document.createElement("div");
    // Give it a class name
    taskInfoEl.className = "task-info";
    // Add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span";
    // Add it to the HTML
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();

    const taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    // and finally it will be added into the HTML
    tasksToDoEl.appendChild(listItemEl);

    // Increase task counter for next unique id
    taskIdCounter++;
};

// Function to finish editing a task
const completeEditTask = function(taskName, taskType, taskId) {
    // Find the matching task list item
    const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // Loop through task array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    success("Task updated successfully!");

    saveTasks();

    // Resets the form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

// Function to create working edit and delete buttons
const createTaskActions = function(taskId) {
    // Container to hold the buttons in
    const actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create Edit button
    const editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "main-btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Create Delete button
    const deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "main-btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Create a dropdown menu to choose Task Type
    const statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // Create array for <option> elements
    const statusChoices = ["To Do", "In Progress", "Completed"];

    // For loop to loop through the array of <option> elements
    for (let i = 0; i < statusChoices.length; i++) {
        // Create Option Element
        const statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // Append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

// Function to decide what happens when either Edit or Delete buttons are clicked
const taskButtonHandler = function(event) {
    // Get target element from event
    const targetEl = event.target;
    const taskId = targetEl.getAttribute("data-task-id");

    // Edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        editTask(taskId);
    }
    // Delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        deleteTask(taskId);
    }
};

// Function to edit a task
const editTask = function(taskId) {
    // Get task list item element
    const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Get content from task name and type
    const taskName = taskSelected.querySelector("h3.task-name").textContent;

    const taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

// Function to delete a task
const deleteTask = function(taskId) {
    const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // Create new array to hold updated list of tasks
    let updatedTaskArr = [];

    // Loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
        // If tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // Reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

// Function to change the status of the task
const taskStatusChangeHandler = function(event) {
    // Get the task item's id
    const taskId = event.target.getAttribute('data-task-id');

    // Get the currently selected option's value and convert to lowercase
    const statusValue = event.target.value.toLowerCase();

    // Find the parent task item element based on the id
    const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Conditional statement to decide where the task goes/moves
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // Update task's in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

// Function to drag the tasks
const dragTaskHandler = function(event) {
    const taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    const getId = event.dataTransfer.getData("text/plain");
}

// Function to create Drop Zones for the task
const dropZoneDragHandler = function(event) {
    const taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

// Function to Drop the task
const dropTaskHandler = function(event) {
    const id = event.dataTransfer.getData("text/plain");
    const draggableElement = document.querySelector("[data-task-id='" + id + "']");
    const dropZoneEl = event.target.closest(".task-list");
    const statusType = dropZoneEl.id;

    // Set status of task based on dropZone id
    const statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    // Change dropdown depending on drop location
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.removeAttribute("style");

    dropZoneEl.appendChild(draggableElement);

    // Loop through tasks array to find and update the updated task's status
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks();
}

// Dragleave Function to help with hover styling when dragging task
const dragLeaveHandler = function(event) {
    const taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// Function to save tasks to localStorage
const saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load the tasks that are stored in localStorage
const loadTasks = function() {
    // Gets task from localStorage
    const storedTasks = localStorage.getItem("tasks");
    // Converts tasks from the string format back into an array of objects
    if (storedTasks === null) {
        tasks = [];
        return false;
    }

    tasks = JSON.parse(storedTasks);

    // This is for Code Optimization 4.5.7, but I couldn't get it to work...
    // Loop through storedTasks array
    /* for (var i = 0; i < storedTasks.length; i++) {
        // Pass each task object into the 'createTaskEl()' function
        createTaskEl(storedTasks[i]);
        console.log(storedTasks[i]);
    } */

    // Iterates through a tasks array and creates task elements on the page from it
    for (let i = 0; i < tasks.length; i++) {
        // To keep the id for each task in sync, reassign the id property of task[i] to the value of taskIdCounter
        tasks[i].id = taskIdCounter;
        // Create an <li> element and store it in a variable called listItemEl
        const listItemEl = document.createElement("li");
        //Give it a classname attribute of task-item
        listItemEl.className = "task-item";
        //With setAttribute(), give it a data-task-id attribute with a value of tasks[i].id
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        //With setAttribute(), give it a draggable attribute with a value of true
        listItemEl.setAttribute("draggable", "true");

        const taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        const taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);

        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter++;
    }
}

// Event Listeners:
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

// Loads any tasks that were saved to the localStorage on reload
loadTasks();