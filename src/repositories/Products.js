import { db } from '../config/knexfile.js';

class ProductRepository {
	async create(product) {
		return await db('products').insert(product);
	}

	async findById(id) {
		const product = await db('products').where({ id }).first();
		return product;
	}

	async listAllProducts() {
		return await db('products').select('*');
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
			categories: product.categories ?? currentProduct.categories,
		};

		await db('products')
			.where({ id })
			.update({
				...updatedProduct,
				categories: JSON.stringify(updatedProduct.categories),
			});

		return updatedProduct;
	}

	async checkProductStock(id) {
		const product = await this.findById(id);
		return product ? product.quantity : 0;
	}
}

export { ProductRepository };
