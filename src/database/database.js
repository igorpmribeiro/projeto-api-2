import sqlite3 from 'sqlite3';

class Database {
	constructor() {
		this.db = new sqlite3.Database('./ecommerce.sqlite');
	}

	init() {
		this.db.run(`CREATE TABLE IF NOT EXISTS products
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL DEFAULT 0,
      quantity NUMBER DEFAULT 0,
      description TEXT DEFAULT NULL,
      codref TEXT DEFAULT NULL,
      categories NUMBER DEFAULT 0)`);

		this.db.run(`CREATE TABLE IF NOT EXISTS categories 
         (id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         title TEXT,
         subtitle TEXT,
         discount NUMBER DEFAULT 0,
         hidden BOOLEAN DEFAULT FALSE)`);

		this.db.run(`CREATE TABLE IF NOT EXISTS attributes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL)`);

		this.db.run(`CREATE TABLE IF NOT EXISTS attribute_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attribute_id INTEGER,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      optionSort NUMBER,
      valueSort NUMBER,
      FOREIGN KEY (attribute_id) REFERENCES attributes(id))`);
	}
}

export default Database;
