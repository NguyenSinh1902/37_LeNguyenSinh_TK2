const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 9080;

app.use(bodyParser.json());
// Kết nối đến cơ sở dữ liệu SQLite
const db = new sqlite3.Database('todos.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', err.message);
  } else {
    console.log('Đã kết nối đến cơ sở dữ liệu SQLite.');
  }
});

// Route mặc định
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors());


// [GET] /todos --get all todos in table ToDoList in SQLite
// [PATCH] /todos/:id/completed --update status of collumn in table ToDoList in SQLite had id to 1
// [PATCH] /todos/:id/uncompleted --update status of collumn in table ToDoList in SQLite had id to 0
// [DELETE] /todos/:id -- delete to do in table ToDoList had id
//[INSERT]

// GET all todos from the ToDoList table in SQLite
app.get('/todos', (req, res) => {
    db.all('SELECT * FROM ToDoList', (err, rows) => {
      if (err) {
        console.error('Lỗi khi truy vấn dữ liệu:', err.message);
        res.status(500).json({ error: 'Lỗi khi truy vấn dữ liệu.' });
      } else {
        res.json(rows);
      }
    });
  });

  function getRandomInt(min, max) {
    // The Math.random() function returns a floating-point,
    // pseudo-random number in the range [0, 1) that is,
    // from 0 (inclusive) up to but not including 1 (exclusive).
    // By multiplying it with (max - min + 1), we get a number
    // from 0 to max - min (inclusive of max - min) and then
    // adding min ensures that the result falls in the desired range.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// POST: Add a new task to the ToDoList table in SQLite
app.post('/todos', (req, res) => {
  const { name, state } = req.body; // Extract name and state from the request body

  const id = getRandomInt(0, 10000);
  // Insert the new task into the ToDoList table
  db.run('INSERT INTO ToDoList (id, name, state) VALUES (?, ?, ?)', [id, name, state], function(err) {
      if (err) {
          console.error('Lỗi khi thêm dữ liệu:', err.message);
          res.status(500).json({ error: 'Lỗi khi thêm dữ liệu.' });
      } else {
          // Return the newly inserted task with its ID
          res.json({ id: this.lastID, name, state });
      }
  });
});


  
  // PATCH: Update status of a todo with given id to completed (status = 1)
  app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;

    const { state } = req.body;

    db.run('UPDATE ToDoList SET state = ? WHERE id = ?', [state , id], function(err) {
      if (err) {
        console.error('Lỗi khi cập nhật dữ liệu:', err.message);
        res.status(500).json({ error: 'Lỗi khi cập nhật dữ liệu.' });
      } else {
        console.log("OK");
        res.json({ message: 'Cập nhật trạng thái thành công.' });
      }
    });
  });
  
  
 // DELETE: Delete a todo with given id
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM ToDoList WHERE id = ?', [id], function(err) {
      if (err) {
          console.error('Lỗi khi xóa dữ liệu:', err.message);
          res.status(500).json({ error: 'Lỗi khi xóa dữ liệu.' });
      } else {
          res.status(204).end(); // Respond with status 204 (No Content) to indicate successful deletion
      }
  });
});

  

// Server lắng nghe trên cổng đã chỉ định
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
