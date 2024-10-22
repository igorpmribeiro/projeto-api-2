import Database from "../database/database.js";

const db = new Database().db;

class AttributeRepository {
  async create(attribute) {
    Promise ((resolve, reject) => {
      db.run('INSERT INTO attributes (groupName, options) VALUES (?, ?)', [attribute.groupName, attribute.options], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }
}

export { AttributeRepository };