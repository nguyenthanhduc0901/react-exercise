const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'users.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing database');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  } else {
    console.log('Created new database');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      process.exit(1);
    } else {
      console.log('Users table created');
      insertSampleData();
    }
  });
}

function insertSampleData() {
  const sampleUsers = [
    ['Nguyen Thanh Duc', 'duc@gmail.com', 'User'],
    ['Tran Trung Kien', 'kien@gmail.com', 'Manager'],
    ['Dang Le Khiem', 'khiem@gmail.com', 'User'],
    ['Nguyen Nhat Anh', 'anh@gmail.com', 'Admin'],
    ['Hoang Kim Son', 'son@gmail.com', 'User']
  ];
  
  const stmt = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)');
  
  sampleUsers.forEach((user, index) => {
    stmt.run(user, (err) => {
      if (err) {
        console.error(`Error inserting user ${index + 1}:`, err.message);
      }
    });
  });
  
  stmt.finalize((err) => {
    if (err) {
      console.error('Error finalizing:', err.message);
    } else {
      console.log('Sample data inserted');
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      }
      process.exit(0);
    });
  });
}
