// IEFE
(() => {
    // state variables
    let toDoListArray = [];
    // ui variables
    const form = document.querySelector(".form");
    const input = form.querySelector(".form__input");
    const ul = document.querySelector(".toDoList");

    // Function to fetch todos from the server
    function fetchTodos() {
        fetch('http://localhost:9080/todos')
            .then(response => response.json())
            .then(todos => {
                // Clear existing todos in the UI
                ul.innerHTML = '';

                // Loop through the received todos and display them in the UI
                todos.forEach(todo => {
                    addItemToDOM(todo.id, todo.name);
                    addItemToArray(todo.id, todo.name);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to add todo to DOM
    function addItemToDOM(itemId, toDoItem) {
        // create a new list item element
        const li = document.createElement('li');
        // set the ID attribute
        li.id = itemId;
        // set the inner HTML of the list item
        li.innerHTML = `<p>- ${toDoItem}</p><button class="deleteBtn" data-id="${itemId}">Delete</button>`;
        // add li to the DOM
        ul.appendChild(li);
    }

    // Function to add todo to array
    function addItemToArray(itemId, toDoItem) {
        // add item to array as an object with an ID so we can find and delete it later
        toDoListArray.push({ itemId, toDoItem });
    }

    // Event listener for form submission
    form.addEventListener('submit', e => {
        e.preventDefault();
        let toDoItem = input.value;
        if (toDoItem.trim() !== '') {
            // Make a POST request to add todo to the server
            fetch('http://localhost:9080/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: toDoItem,
                    state: 0 // Assuming default state is 0 (todo)
                })
            })
            .then(response => response.json())
            .then(data => {
                // Add the newly created todo to the DOM and array
                addItemToDOM(data.id, data.name);
                addItemToArray(data.id, data.name);
            })
            .catch(error => console.error('Error:', error));

            input.value = ''; // Clear input field
        }
    });

    // Event listener for todo deletion
    ul.addEventListener('click', e => {
        if (e.target.classList.contains('deleteBtn')) {
            let id = e.target.parentElement.id;
            // Make a DELETE request to delete todo from the server
            fetch(`http://localhost:9080/todos/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                // Remove the deleted todo from the DOM and array
                let index = toDoListArray.findIndex(item => item.itemId === id);
                if (index !== -1) {
                    toDoListArray.splice(index, 1);
                }
                let li = document.getElementById(id);
                li.parentNode.removeChild(li);
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Call the function to fetch todos when the page loads
    fetchTodos();
})();
