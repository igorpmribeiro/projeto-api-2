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

	async update(id, category) {
		await db('categories').where({ id }).update({
			name: category.name,
			title: category.title,
			subtitle: category.subtitle,
			hidden: category.hidden,
			discount: category.discount,
			image: category.image,
		});

		return await this.findById(id);
	}

	async listAllCategories() {
		return await db('categories').select('*');
	}
}

export { CategoryRepository };
