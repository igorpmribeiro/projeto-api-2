import Database from "../database/database.js";

const db = new Database().db;

class CategoryRepository {
  async create(category) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO categories (name, subtitle, hidden, discount, image) VALUES (?)`, [category.name, category.subtitle, category.hidden, category.discount, category.image], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export { CategoryRepository };