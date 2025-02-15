import { db } from '../config/knexfile.js';

class ProductRepository {
	async create(product) {
		const productToSave = {
			...product,
			dimensions: JSON.stringify(product.dimensions),
			images: JSON.stringify(product.images),
			categories: JSON.stringify(product.categories),
		};

		const [id] = await db('products').insert(productToSave);
		return {
			...product,
			id,
		};
	}

	async findById(id) {
		const product = await db('products').where({ id }).first();
		if (product) {
			return {
				...product,
				dimensions: JSON.parse(product.dimensions || '[]'),
				images: JSON.parse(product.images || '[]'),
				categories: JSON.parse(product.categories || '[]'),
			};
		}
		return product;
	}

	async listAllProducts() {
		const products = await db('products').select('*');
		return products.map((product) => ({
			...product,
			dimensions: JSON.parse(product.dimensions || '[]'),
			images: JSON.parse(product.images || '[]'),
			categories: JSON.parse(product.categories || '[]'),
		}));
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
