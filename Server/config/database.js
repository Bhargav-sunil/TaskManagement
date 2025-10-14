const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "..", "database.sqlite");

let db = null;

const init = () => {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
      createTables();
      createDefaultAdmin();
    }
  });
};

const createTables = () => {
  // Users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tasks
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    user_id INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (created_by) REFERENCES users (id)
  )`);
};

const createDefaultAdmin = () => {
  const adminEmail = "bhargav@gmail.com";
  const adminPassword = "Bhargav@123";

  // Admin
  db.get("SELECT * FROM users WHERE email = ?", [adminEmail], (err, row) => {
    if (err) {
      console.error("Error checking admin:", err);
      return;
    }

    if (!row) {
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["System Admin", adminEmail, hashedPassword, "admin"],
        function (err) {
          if (err) {
            console.error("Error creating admin:", err);
          } else {
            console.log(
              "Default admin created:",
              adminEmail,
              "Password:",
              adminPassword
            );
          }
        }
      );
    }
  });
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};

module.exports = {
  init,
  getDb,
};
