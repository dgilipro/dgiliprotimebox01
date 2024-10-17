document.addEventListener('DOMContentLoaded', function() {
    const taskTbody = document.getElementById('task-tbody');
    const addTaskButton = document.getElementById('add-task');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const completedTasksList = document.getElementById('completed-tasks');
    const printButton = document.getElementById('print-button');
    const resetButton = document.getElementById('reset-button');
    const dateInput = document.getElementById('date');
    const topPriorities = document.getElementById('top-priorities');
    const brainDump = document.getElementById('brain-dump');

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Load saved data
    loadSavedData();

    function createTaskRow(time = '', task = '', done = false) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="time-input">
                    <input type="time" class="start-time" value="${time.split(' to ')[0] || ''}">
                    <span>to</span>
                    <input type="time" class="end-time" value="${time.split(' to ')[1] || ''}">
                </div>
            </td>
            <td><input type="text" class="task-description" placeholder="Enter task" value="${task}"></td>
            <td><input type="checkbox" class="task-done" ${done ? 'checked' : ''}></td>
            <td><button class="remove-task">−</button></td>
        `;
        return row;
    }

    function updateProgress() {
        const totalTasks = taskTbody.querySelectorAll('tr').length;
        const completedTasks = taskTbody.querySelectorAll('.task-done:checked').length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
    }

    function updateCompletedTasks() {
        completedTasksList.innerHTML = '';
        taskTbody.querySelectorAll('tr').forEach(row => {
            const checkbox = row.querySelector('.task-done');
            const taskDescription = row.querySelector('.task-description').value;
            if (checkbox.checked && taskDescription.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = taskDescription;
                completedTasksList.appendChild(li);
            }
        });
    }

    function saveData() {
        const tasks = [];
        taskTbody.querySelectorAll('tr').forEach(row => {
            const startTime = row.querySelector('.start-time').value;
            const endTime = row.querySelector('.end-time').value;
            const task = row.querySelector('.task-description').value;
            const done = row.querySelector('.task-done').checked;
            tasks.push({ time: `${startTime} to ${endTime}`, task, done });
        });

        const data = {
            date: dateInput.value,
            topPriorities: topPriorities.value,
            brainDump: brainDump.value,
            tasks: tasks
        };

        localStorage.setItem('timeboxProData', JSON.stringify(data));
    }

    function loadSavedData() {
        const savedData = localStorage.getItem('timeboxProData');
        if (savedData) {
            const data = JSON.parse(savedData);
            dateInput.value = data.date;
            topPriorities.value = data.topPriorities;
            brainDump.value = data.brainDump;

            taskTbody.innerHTML = '';
            data.tasks.forEach(task => {
                const newRow = createTaskRow(task.time, task.task, task.done);
                taskTbody.appendChild(newRow);
            });

            updateProgress();
            updateCompletedTasks();
        } else {
            resetPlanner();
        }
    }

    function resetPlanner() {
        // Clear all input fields
        dateInput.value = today;
        topPriorities.value = '';
        brainDump.value = '';

        // Clear task list
        taskTbody.innerHTML = '';

        // Add three empty rows
        for (let i = 0; i < 3; i++) {
            taskTbody.appendChild(createTaskRow());
        }

        // Reset progress
        updateProgress();
        updateCompletedTasks();

        // Clear local storage
        localStorage.removeItem('timeboxProData');
    }

    addTaskButton.addEventListener('click', function() {
        const newRow = createTaskRow();
        taskTbody.appendChild(newRow);
        updateProgress();
        saveData();
    });

    taskTbody.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-task')) {
            e.target.closest('tr').remove();
            updateProgress();
            updateCompletedTasks();
            saveData();
        }
    });

    taskTbody.addEventListener('change', function(e) {
        if (e.target.classList.contains('task-done') || e.target.classList.contains('task-description') || 
            e.target.classList.contains('start-time') || e.target.classList.contains('end-time')) {
            updateProgress();
            updateCompletedTasks();
            saveData();
        }
    });

    printButton.addEventListener('click', function() {
        window.print();
    });

    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the planner? This will clear all data.')) {
            resetPlanner();
        }
    });

    dateInput.addEventListener('change', saveData);
    topPriorities.addEventListener('input', saveData);
    brainDump.addEventListener('input', saveData);

    // Save data when leaving the page
    window.addEventListener('beforeunload', saveData);
});
