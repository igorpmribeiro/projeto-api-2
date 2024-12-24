import Database from '../database/database.js';
import { db } from '../config/knexfile.js';

// const db = new Database().db;

class CategoryRepository {
	async create(category) {
		knex.insert(category).into('categories');
	}
}

export { CategoryRepository };
