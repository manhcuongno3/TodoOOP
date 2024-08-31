const StateOfFilterTasks = Object.freeze({
  ALL: 'all',
  DONE: 'done',
  NOT_DONE: 'not_done'
});

const $ = document.querySelector.bind(document)

function TaskManager(tasks = []) {
  this.tasks = tasks;
  this.currentTaskIndex = null;
  this.currentFilter = StateOfFilterTasks.ALL;

  this.taskList = $('.list__task');
  this.addTaskButton = $('.add__button');
  this.clearTaskNameInputButton = $('.clear__button');
  this.saveTaskButton = $('.save-modal');
  this.cancelAddTaskButton = $('.cancel-modal');
  this.editTaskModal = $('.modal');
  this.filterTaskInput = $('#filter');

  this.addTaskButton.onclick = this.addTask.bind(this);
  this.clearTaskNameInputButton.onclick = this.clearTaskNameInput.bind(this);
  this.saveTaskButton.onclick = this.saveTaskAfterEdit.bind(this);
  this.cancelAddTaskButton.onclick = this.cancelEdit.bind(this);
  this.filterTaskInput.onchange = this.filterTasks.bind(this);

  this.renderTasks(); 
}

TaskManager.prototype.addTask = function () {
  const taskNameInput = $('.add__input');
  const taskName = taskNameInput.value;

  if (taskName) {
      if (this.currentFilter === StateOfFilterTasks.DONE) {
          this.currentFilter = StateOfFilterTasks.ALL;
          this.filterTaskInput.value = StateOfFilterTasks.ALL;
      }
      this.tasks.push({ name: taskName, isDone: false });
      taskNameInput.value = '';
      this.renderTasks();
  }
};

TaskManager.prototype.clearTaskNameInput = function () {
  $('.add__input').value = '';
};

TaskManager.prototype.deleteTask = function (index) {
  this.tasks.splice(index, 1);
  this.renderTasks();
};

TaskManager.prototype.openEditTaskModal = function (index) {
  this.currentTaskIndex = index;
  const editInput = $('.edit__input');
  editInput.value = this.tasks[index].name;
  this.editTaskModal.classList.add('open');
};

TaskManager.prototype.saveTaskAfterEdit = function () {
  const newName = $('.edit__input').value;
  this.editTaskModal.classList.remove('open');
  if (newName) {
      this.tasks[this.currentTaskIndex].name = newName;
      this.renderTasks();
  }
};

TaskManager.prototype.cancelEdit = function () {
  this.editTaskModal.classList.remove('open');
};


TaskManager.prototype.toggleTask = function (index) {
  this.tasks[index].isDone = !this.tasks[index].isDone;
  this.renderTasks();
};

TaskManager.prototype.filterTasks = function() {
  this.currentFilter = this.filterTaskInput.value;
  this.renderTasks();
};

TaskManager.prototype.renderTasks = function () {
  this.taskList.innerHTML = '';

  const filteredTasks = this.tasks.filter(task => {
      if (this.currentFilter === StateOfFilterTasks.ALL) {
          return true;
      } else if (this.currentFilter === StateOfFilterTasks.DONE) {
          return task.isDone;
      } else {
          return !task.isDone;
      }
  });

  filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
          <input class="check-box" type="checkbox" ${task.isDone ? 'checked' : ''} onclick="taskManager.toggleTask(${index})">
          <span>${task.name}</span>
          <button onclick="taskManager.openEditTaskModal(${index})">Edit</button>
          <button class="red-button" onclick="taskManager.deleteTask(${index})">Delete</button>
      `;
      this.taskList.appendChild(taskItem);
  });
};

const taskManager = new TaskManager();
