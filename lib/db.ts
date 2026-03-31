import Database from 'better-sqlite3';
import path from 'path';

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'vulnerable.db');
const db = new Database(dbPath);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  )
`);

// Insert demo users (only if table is empty)
const count = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
  insert.run('admin@example.com', 'admin123', 'admin');
  insert.run('user@example.com', 'user123', 'user');
  insert.run('test@example.com', 'test123', 'user');
  console.log('✅ Demo users created');
}

export default db;
