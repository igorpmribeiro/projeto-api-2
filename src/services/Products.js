import { ProductRepository } from '../repositories/Products.js';
import { Product } from '../models/Product.js';

class ProductService {
	constructor() {
		this.productRepository = new ProductRepository();
	}

	async create(product) {
		const newProduct = new Product(
			null,
			product.name,
			product.price,
			product.quantity,
			product.description,
			product.codref,
			product.categories,
		);
		return this.productRepository.create(newProduct);
	}
	async findById(id) {
		return await this.productRepository.findById(id);
	}
	async listAllProducts() {
		return await this.productRepository.listAllProducts();
	}
	async updateProduct(id, product) {
		return await this.productRepository.updateProduct(id, product);
	}
}

export { ProductService };
