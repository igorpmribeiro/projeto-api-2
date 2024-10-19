import sqlite3 from 'sqlite3';

class Database { 
  constructor() {
    this.db = new sqlite3.Database(`./product.sqlite`);
  }

  init() {
    this.db.run(`CREATE TABLE IF NOT EXISTS products
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL DEFAULT 0,
      quantity NUMBER DEFAULT 0,
      description TEXT DEFAULT NULL,
      categories NUMBER DEFAULT 0,
      codref TEXT DEFAULT NULL)`);
  }
}

export default Database;