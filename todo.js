let tasks = [];

const searchInput = document.getElementById('search');
const taskboxes = document.querySelector('.taskboxes');
const taskaddbutton = document.getElementById('taskaddbutton');
const completedcheck = document.getElementById('completedcheck');
const taskModal = document.getElementById('taskModal');
const closeBtn = document.querySelector('.close-btn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
let currentEditIndex = null;

searchInput.addEventListener('input', filterTasks);
taskaddbutton.addEventListener('click', () => openModal());
completedcheck.addEventListener('click', removetasks);
closeBtn.addEventListener('click', closeModal);
saveTaskBtn.addEventListener('click', saveTask);

function isDeadlinePassed(deadline) {
    const [day, month, year] = deadline.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    return currentDate > deadlineDate;
}

function rendertasks() {
    taskboxes.innerHTML = '';
    
    if (tasks.length === 0) {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.textContent = 'No tasks remaining';
        noTasksMessage.classList.add('notasksmessage');
        taskboxes.appendChild(noTasksMessage);
    } else {
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            if (task.completed) {
                taskDiv.classList.add('completed');
            } else if (isDeadlinePassed(task.deadline)) {
                taskDiv.classList.add('overdue');
            }
            taskDiv.innerHTML = `
                <h3>${task.title}</h3>
                <p id="descptn">${task.description}</p>
                <p id="deadln">Deadline: <span id='deadlnspan'>${task.deadline}</span></p>
                <div class="actions">
                    <button class="complete-btn" onclick="taskcompleted(${index})">${task.completed ? 'Undo' : 'Done'}</button>
                    <button class="edit-btn" onclick="edittask(${index})">Edit</button>
                    <button class="delete-btn" onclick="deletetask(${index})">Delete</button>
                </div>`;
            taskboxes.appendChild(taskDiv);
        });
    }
}

function openModal(task = {}, index = null) {
    document.getElementById('taskTitle').value = task.title || '';
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskDeadline').value = task.deadline || '';
    taskModal.style.display = 'flex';
    currentEditIndex = index;
}

function closeModal() {
    taskModal.style.display = 'none';
}

function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;

    if (title && description && deadline) {
        if (tasks.some((task, index) => task.title === title && index !== currentEditIndex)) {
            const taskalertmsg=`The task: ${title} already exists!`;
            alert(taskalertmsg);
            return false;
        }
        const newTask = {
            title: title,
            description: description,
            deadline: deadline,
            completed: false
        };

        if (currentEditIndex !== null) {
            tasks[currentEditIndex] = newTask;
            currentEditIndex = null;
        } else {
            tasks.push(newTask);
        }
        
        rendertasks();
        closeModal();
    } else {
        alert('Please fill out all fields.');
    }
}

function addtask() {
    openModal();
}

function edittask(index) {
    const task = tasks[index];
    openModal(task, index);
}

function taskcompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    rendertasks();
}

function deletetask(index) {
    tasks.splice(index, 1);
    rendertasks();
}

function removetasks() {
    taskboxes.classList.toggle('show-completed');
    completedcheck.classList.toggle('completed-button');
}

function filterTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
    );
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    taskboxes.innerHTML = ''; 
    filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        if (task.completed) {
            taskDiv.classList.add('completed');
        } else if (isDeadlinePassed(task.deadline)) {
            taskDiv.classList.add('overdue');
        }
        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Deadline: ${task.deadline}</p>
            <div class="actions">
                <button class="complete-btn" onclick="taskcompleted(${index})">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="edit-btn" onclick="edittask(${index})">Edit</button>
                <button class="delete-btn" onclick="deletetask(${index})">Delete</button>
            </div>
        `;
        taskboxes.appendChild(taskDiv);
    });
}

function filterCompletedTasks() {
    const isChecked = completedcheck.checked;
    const filteredTasks = isChecked ? tasks.filter(task => task.completed) : tasks;
    renderFilteredTasks(filteredTasks);
}

rendertasks();