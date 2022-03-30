var taskIdCounter = 0;

var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

var taskFormHandler = function(event) {
    // Prevents the page from reloading when form is submitted
    event.preventDefault();

    // Creates a variable that will be what is typed in the task name field
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    // Creates a variable that will be what is selected as the task type
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Makes sure that Name and Type were filled out
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // Resets the form after each submission
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    // Has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // No data attribute, so create object as normal and pass to createTaskEl function
    else {
        // Package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        // Send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
}

// Function to create a new task
var createTaskEl = function(taskDataObj) {
    // a new <li> element is created
    var listItemEl = document.createElement("li");
    // it is given the "task-item" class to be styled
    listItemEl.className = "task-item";

    // Add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    // Makes listItemEl draggable
    listItemEl.setAttribute("draggable", "true");

    // Create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // Give it a class name
    taskInfoEl.className = "task-info";
    // Add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span";
    // Add it to the HTML
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    // and finally it will be added into the HTML
    tasksToDoEl.appendChild(listItemEl);

    // Increase task counter for next unique id
    taskIdCounter++;
};

// Function to finish editing a task
var completeEditTask = function(taskName, taskType, taskId) {
    // Find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // Loop through task array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = tasktype;
        }
    };
    alert("Task Updated!");

    completeEditTask();

    // Resets the form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

// Function to create working edit and delete buttons
var createTaskActions = function(taskId) {
    // Container to hold the buttons in
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create Edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "main-btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Create Delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "main-btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Create a dropdown menu to choose Task Type
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // Create array for <option> elements
    var statusChoices = ["To Do", "In Progress", "Completed"];

    // For loop to loop through the array of <option> elements
    for (var i = 0; i < statusChoices.length; i++) {
        // Create Option Element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // Append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};



// Function to decide what happens when either Edit or Delete buttons are clicked
var taskButtonHandler = function(event) {
    // Get target element from event
    var targetEl = event.target;

    // Edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // Delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // Get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

// Function to edit a task
var editTask = function(taskId) {

    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

// Function to delete a task
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // Create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
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
var taskStatusChangeHandler = function(event) {
    // Get the task item's id
    var taskId = event.target.getAttribute('data-task-id');

    // Get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

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
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

// Function to drag the tasks
var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
}

// Function to create Drop Zones for the task
var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

// Function to Drop the task
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    // Set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
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
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks();
}

// Dragleave Function to help with hover styling when dragging task
var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// Function to save tasks to localStorage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load the tasks that are stored in localStorage
var loadTasks = function() {
    // Gets task from localStorage
    var storedTasks = localStorage.getItem("tasks");
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
    for (var i = 0; i < tasks.length; i++) {
        // To keep the id for each task in sync, reassign the id property of task[i] to the value of taskIdCounter
        tasks[i].id = taskIdCounter;
        // Create an <li> element and store it in a variable called listItemEl
        var listItemEl = document.createElement("li");
        //Give it a classname attribute of task-item
        listItemEl.className = "task-item";
        //With setAttribute(), give it a data-task-id attribute with a value of tasks[i].id
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        //With setAttribute(), give it a draggable attribute with a value of true
        listItemEl.setAttribute("draggable", "true");

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(tasks[i].id);
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

// When the User submits the form to add task, taskFormHandler runs
// It is listening for the User to hit submit OR hit the enter key
formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);

pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);

// Loads any tasks that were saved to the localStorage on reload
loadTasks();