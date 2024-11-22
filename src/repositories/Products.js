import Database from '../database/database.js';

const db = new Database().db;

class ProductRepository {
	async create(product) {
		return new Promise((resolve, reject) => {
			db.run(
				'INSERT INTO products (name, price, quantity, description, codref, categories) VALUES (?, ?, ?, ?, ?, ?)',
				[
					product.name,
					product.price,
					product.quantity,
					product.description,
					product.codref,
					JSON.stringify(product.categories),
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

	async listAllProducts() {
		return new Promise((resolve, reject) => {
			db.all('SELECT * FROM products', (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	async updateProduct(id, product) {
		const currentProduct = await this.findById(id);
		if (!currentProduct) {
			throw new Error('Product not found');
		}

		const updatedProduct = {
			name: product.name ?? currentProduct.name,
			price: product.price ?? currentProduct.price,
			quantity: product.quantity ?? currentProduct.quantity,
			description: product.description ?? currentProduct.description,
			codref: product.codref ?? currentProduct.codref,
			categories: product.categories ?? JSON.parse(currentProduct.categories),
		};

		return new Promise((resolve, reject) => {
			db.run(
				'UPDATE products SET name = ?, price = ?, quantity = ?, description = ?, codref = ?, categories = ? WHERE id = ?',
				[
					updatedProduct.name,
					updatedProduct.price,
					updatedProduct.quantity,
					updatedProduct.description,
					updatedProduct.codref,
					JSON.stringify(updatedProduct.categories),
					id,
				],
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(updatedProduct);
					}
				},
			);
		});
	}

	async checkProductStock(id) {
		const product = await this.findById(id);

		return product ? product.quantity : 0;
	}
}

export { ProductRepository };
