import Database from '../database/database.js';
import { db } from '../config/knexfile.js';

// const db = new Database().db;

class CategoryRepository {
	async create(category) {
		return await db('categories').insert(category);
	}

	async findById(id) {
		const category = await db('categories').where({ id }).first();

		return category;
	}
}

export { CategoryRepository };
