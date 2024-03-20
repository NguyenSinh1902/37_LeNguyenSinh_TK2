// Function to fetch and display tasks from the server
function fetchAndDisplayTasks() {
    // Send a GET request to fetch tasks from the server
    fetch('http://localhost:9080/todos')
    .then(response => response.json())
    .then(tasks => {

        // Loop through the received tasks and display them in the UI
        tasks.forEach(task => {
            var li = document.createElement("li");
            li.setAttribute('id', task.id);
            li.draggable = true;
            li.innerHTML = `<p>${task.name}</p><button class="deleteBtn" onclick="deleteTask(${task.id})">Delete</button>`;
            li.addEventListener("dragstart", drag);
            if (task.state === 0) 
                document.getElementById("todo-list").appendChild(li);
            else document.getElementById("completed-board").appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Call the function to fetch and display tasks when the page loads
window.onload = fetchAndDisplayTasks;



function addTask() {
    var input = document.getElementById("taskInput").value;
    if (input === '') {
        alert("You must write something!");
    } else {
        // Make a POST request to create a new task
        fetch('http://localhost:9080/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: input,
                state: 0 // Set initial state to 0 (uncompleted)
            })
        })
        .then(response => response.json())
        .then(data => {
            // If the task is created successfully, add it to the UI
            var li = document.createElement("li");
            var itemId = data.id;
            li.setAttribute('id', itemId);
            li.draggable = true;
            li.innerHTML = `<p>${input}</p><button class="deleteBtn" onclick="deleteTask(${itemId})">Delete</button>`;
            li.addEventListener("dragstart", drag);
            document.getElementById("todo-list").appendChild(li);
            document.getElementById("taskInput").value = "";
        })
        .catch(error => console.error('Error:', error));
    }
}
function deleteTask(itemId) {
    if (confirm("Are you sure you want to delete this task?")) {
        // Make a DELETE request to delete the task
        fetch(`http://localhost:9080/todos/${itemId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // If the deletion was successful, remove the task from the UI
                var item = document.getElementById(itemId);
                item.parentNode.removeChild(item);
                console.log('Task deleted successfully');
            } else {
                throw new Error('Failed to delete task');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}


function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var targetBoard = event.target.closest('.board');
    targetBoard.querySelector('ul').appendChild(document.getElementById(data));

    // Extract the task ID from the dropped element's ID
    var taskId = data;

    // Determine the status based on the target board
    var status = targetBoard.id === 'completed-board' ? 1 : 0;

    // Send a PATCH request to update the status of the task
    fetch(`http://localhost:9080/todos/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            state: status
        })
    })
    .then(response => response.json())
    .then(data => console.log('Task status updated successfully'))
    .catch(error => console.error('Error:', error));
}
