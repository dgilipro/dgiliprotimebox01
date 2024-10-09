document.addEventListener('DOMContentLoaded', function() {
    const taskTable = document.getElementById('task-tbody');
    const addTaskButton = document.getElementById('add-task');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const completedTasksList = document.getElementById('completed-tasks');
    const printButton = document.getElementById('print-button');
    const dateInput = document.getElementById('date');

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    function createTaskRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="time" class="start-time"> to 
                <input type="time" class="end-time">
            </td>
            <td><input type="text" class="task-description" placeholder="Enter task"></td>
            <td><input type="checkbox" class="task-done"></td>
            <td><button class="minus-sign">−</button></td>
        `;
        return row;
    }

    function updateProgress() {
        const totalTasks = taskTable.querySelectorAll('tr').length;
        const completedTasks = taskTable.querySelectorAll('.task-done:checked').length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
    }

    function updateCompletedTasks() {
        completedTasksList.innerHTML = '';
        taskTable.querySelectorAll('tr').forEach(row => {
            const checkbox = row.querySelector('.task-done');
            const taskDescription = row.querySelector('.task-description').value;
            if (checkbox.checked && taskDescription.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = taskDescription;
                completedTasksList.appendChild(li);
            }
        });
    }

    addTaskButton.addEventListener('click', function() {
        const newRow = createTaskRow();
        taskTable.appendChild(newRow);
        updateProgress();
    });

    taskTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('minus-sign')) {
            e.target.closest('tr').remove();
            updateProgress();
            updateCompletedTasks();
        }
    });

    taskTable.addEventListener('change', function(e) {
        if (e.target.classList.contains('task-done') || e.target.classList.contains('task-description')) {
            updateProgress();
            updateCompletedTasks();
        }
    });

    printButton.addEventListener('click', function() {
        window.print();
    });

    // Initialize with a few empty rows
    for (let i = 0; i < 3; i++) {
        taskTable.appendChild(createTaskRow());
    }
});
