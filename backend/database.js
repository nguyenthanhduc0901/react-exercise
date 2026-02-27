const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
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
    } else {
      console.log('Users table ready');
      
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (!err && row.count === 0) {
          const sampleUsers = [
            ['Nguyen Thanh Duc', 'duc@gmail.com', 'User'],
            ['Tran Trung Kien', 'kien@gmail.com', 'Manager'],
            ['Dang Le Khiem', 'khiem@gmail.com', 'User'],
            ['Nguyen Nhat Anh', 'anh@gmail.com', 'Admin'],
            ['Hoang Kim Son', 'son@gmail.com', 'User']
          ];
          
          const stmt = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)');
          sampleUsers.forEach(user => {
            stmt.run(user);
          });
          stmt.finalize();
          console.log('Sample data inserted');
        }
      });
    }
  });
}

module.exports = db;
