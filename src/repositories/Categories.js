import Database from '../database/database.js';

const db = new Database().db;

class CategoryRepository {
	async create(category) {
		return new Promise((resolve, reject) => {
			db.run(
				'INSERT INTO categories (name, title, subtitle, hidden, discount) VALUES (?, ?, ?, ?, ?)',
				[
					category.name,
					category.title,
					category.subtitle,
					category.hidden,
					category.discount,
				],
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				},
			);
		});
	}
}

export { CategoryRepository };
