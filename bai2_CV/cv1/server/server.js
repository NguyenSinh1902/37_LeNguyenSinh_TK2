const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Kết nối đến cơ sở dữ liệu SQLite
const db = new sqlite3.Database('cv1.sqlite', sqlite3.OPEN_READWRITE, (err) => {
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

// Route để lấy dữ liệu từ bảng work_experience
app.get('/work_experience', (req, res) => {
  db.all('SELECT * FROM work_experience', [], (err, rows) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err.message);
      res.status(500).send('Lỗi khi truy vấn dữ liệu.');
    } else {
      res.json(rows);
    }
  });
});

// Route để lấy dữ liệu từ bảng education
app.get('/education', (req, res) => {
  db.all('SELECT * FROM education', [], (err, rows) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err.message);
      res.status(500).send('Lỗi khi truy vấn dữ liệu.');
    } else {
      res.json(rows);
    }
  });
});

// Route để lấy dữ liệu từ bảng skills
app.get('/skills', (req, res) => {
  db.all('SELECT * FROM skills', [], (err, rows) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err.message);
      res.status(500).send('Lỗi khi truy vấn dữ liệu.');
    } else {
      res.json(rows);
    }
  });
});


// Server lắng nghe trên cổng đã chỉ định
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
