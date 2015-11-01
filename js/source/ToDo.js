/*global dragula*/

import {Model} from 'Model';

/**
 * Creates a new ToDo.
 * @class object ToDo
 */
export class ToDo {
  constructor() {
    // Cached element target name
    // TODO: Make these letiables customisable by passing in an options object into the constructor
    this.addInputTarget = 'add-input';
    this.addButtonTarget = 'add-button';
    this.todoListTarget = 'todo-list';
    this.doneListTarget = 'done-list';
    this.taskInputTarget = 'task-input';
    this.taskEditTarget = 'task-edit';
    this.taskDeleteTarget = 'task-delete';
    this.taskCheckboxTarget = 'task-checkbox';
    this.alertTarget = 'alert';
    this.taskDoneClass = 'ToDo-task--done';
    this.taskTemplate = '<li class="ToDo-task {{doneClass}}" data-id="{{id}}">' + '<input id="checkbox-{{id}}" class="ToDo-checkbox" type="checkbox" data-target="task-checkbox" {{checked}}>' + '<label for="checkbox-{{id}}" class="check-box"></label>' + '<input class="ToDo-textfield" type="textfield" value="{{name}}" data-target="task-input" disabled>' + '<button class="ToDo-button" data-target="task-edit">Edit</button>' + '<button class="ToDo-button" data-target="task-delete">Delete</button>' + '</li>';

    // Cached DOM elements
    this.addInputElement = document.querySelector('[data-target="' + this.addInputTarget + '"]');
    this.addButtonElement = document.querySelector('[data-target="' + this.addButtonTarget + '"]');
    this.todoListElement = document.querySelector('[data-target="' + this.todoListTarget + '"]');
    this.doneListElement = document.querySelector('[data-target="' + this.doneListTarget + '"]');
    this.alertElement = document.querySelector('[data-target="' + this.alertTarget + '"]');

    // Constructs a new model
    this.model = new Model('toDo');
  }

  /**
   * getTaskTemplate - Gets the task HTML template
   *
   * @function getTaskTemplate
   * @param {string} name - Name of the task
   * @param {int} id - ID of the task
   * @param {boolean} done - Whether the task is done or not
   * @returns {string}
   */
  getTaskTemplate(name, id, done) {
    'use strict';

    let taskTemplate = this.taskTemplate;

    taskTemplate = taskTemplate.replace(/{{name}}/g, name);
    taskTemplate = taskTemplate.replace(/{{id}}/g, id);

    if (done) {
      taskTemplate = taskTemplate.replace(/{{doneClass}}/g, this.taskDoneClass);
      taskTemplate = taskTemplate.replace(/{{checked}}/g, 'checked');
    } else {
      taskTemplate = taskTemplate.replace(/{{doneClass}}/g, '');
      taskTemplate = taskTemplate.replace(/{{checked}}/g, '');
    }

    return taskTemplate;
  }

  /**
   * setTask - Sets up tasks, adds them if they don't exist, otherwise modify
   *
   * @function setTask
   * @param {string} name - Name of the task
   * @param {int} id - ID of the task
   * @param {boolean} done - Whether the task is done or not
   */
  setTask(name, id, done) {
    let taskHTML = this.getTaskTemplate(name, id, done);

    // If done is true then add task to the done list
    if (done) {
      this.doneListElement.innerHTML += taskHTML;
    } else {
      this.todoListElement.innerHTML += taskHTML;
    }

    // If the task exists in the model then modify its done state instead
    if (this.model.get(id)) {
      this.model.modify(id, {
        done: done
      });
    } else {
      this.model.add({
        name: name,
        id: id,
        done: done
      });
    }
  }

  /**
   * todoController - Controller for functions of the ToDo
   *
   * @function todoController
   */
  todoController() {
    'use strict';

    this.addButtonElement.addEventListener('click', (function () {
      let taskID;

      // Generates a random task ID and ensures it doesn't match any existing
      // task ID, if it does then regenerate until nothing matches
      do {
        taskID = Math.floor(Math.random() * 999999);
      } while (this.model.get(taskID));

      if (this.addInputElement.value) {
        // If task input is not empty then add task
        this.alertElement.classList.add('is-hidden');
        this.setTask(this.addInputElement.value, taskID, false);
        this.addInputElement.value = '';
      } else {
        // If task is empty then show a warning
        this.alertElement.textContent = 'Whoops! You forget the task name!';
        this.alertElement.classList.remove('is-hidden');
      }
    }).bind(this));
  }

  /**
   * taskController - Controller for the tasks
   *
   * @function taskController
   */
  taskController() {
    'use strict';

    // Changes the done state of a task
    let changeStatus = (function (task, done) {
      let taskInput = task.querySelector('[data-target="' + this.taskInputTarget + '"]');
      let taskID = parseInt(task.getAttribute('data-id'), 10);
      let taskValue = taskInput.value;

      // Removes the task's DOM element
      task.remove();
      // Creates a new tasks with the updated paramters
      this.setTask(taskValue, taskID, done);
    }).bind(this);

    let toggleEdit = (function (task) {
      let taskInput = task.querySelector('[data-target="' + this.taskInputTarget + '"]');
      let taskEdit = task.querySelector('[data-target="' + this.taskEditTarget + '"]');
      let taskValue = taskInput.value;
      let taskID = parseInt(task.getAttribute('data-id'));

      // Toggles the input field and add .is-editting class task
      if (taskInput.hasAttribute('disabled')) {
        task.classList.add('is-editing');
        taskInput.removeAttribute('disabled');
        taskEdit.innerHTML = 'Done';
      } else {
        task.classList.remove('is-editing');
        taskInput.setAttribute('disabled', '');
        taskEdit.innerHTML = 'Edit';
      }

      // Modifies the task with the updated name
      this.model.modify(taskID, {
        name: taskValue
      });
    }).bind(this);

    document.querySelector('body').addEventListener('click', (function (event) {
      // Gets the parent element of the task
      let task = event.target.parentNode;

      // If the checkbox is clicked, change its status
      if (event.target.getAttribute('data-target') === this.taskCheckboxTarget) {
        changeStatus(task, event.target.checked);
      }

      // If the edit button is clicked, toggle edit mode
      if (event.target.getAttribute('data-target') === this.taskEditTarget) {
        toggleEdit(task);
      }

      // If the delete button is clicked, delete DOM and updated model
      if (event.target.getAttribute('data-target') === this.taskDeleteTarget) {
        let taskID = parseInt(task.getAttribute('data-id'));

        task.remove();
        this.model['delete'](taskID);
      }
    }).bind(this));

    // Inits dragula library, check Pen settings > JavaScript for external link
    // https://github.com/bevacqua/dragula
    let drag = dragula([this.todoListElement, this.doneListElement]);

    // Dragula's drop event listener
    // TODO: Change ordering in model on drag and drop
    drag.on('drop', (function (el, target) {
      let taskID = parseInt(el.getAttribute('data-id'));
      let taskCheckbox = el.querySelector('[data-target="task-checkbox"]');
      let modifyTask = (function (taskID, done) {
        taskCheckbox.checked = done;
        this.model.modify(taskID, {
          done: done
        });
      }).bind(this);

      if (target.getAttribute('data-target') === this.doneListTarget) {
        // If task is dragged into the done list
        modifyTask(taskID, true);
      } else if (target.getAttribute('data-target') === this.todoListTarget) {
        // If task is dragged into the to do list
        modifyTask(taskID, false);
      }
    }).bind(this));
  }

  /**
   * init - Inits the ToDo and adds existing tasks from localStorage
   *
   * @function init
   */
  init() {
    'use strict';

    // Retreive and cache model
    let model = this.model.get();
    // Clears the model to be rebuilt by the setTask function
    this.model.clear();

    // Adds exists tasks from model
    model.forEach((function (element) {
      this.setTask(element.name, element.id, element.done);
    }).bind(this));

    // Inits the controllers
    this.todoController();
    this.taskController();
  }
}
