import Database from '../database/database.js';

const db = new Database().db;

class ProductRepository {
	async create(product) {
		return new Promise((resolve, reject) => {
			db.run(
				'INSERT INTO products (name, price, quantity, description, categories, codref) VALUES (?, ?, ?, ?, ?, ?)',
				[
					product.name,
					product.price,
					product.quantity,
					product.description,
					product.categories,
					product.codref,
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

	async findById(id) {
		return new Promise((resolve, reject) => {
			db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});
	}
}

export { ProductRepository };
