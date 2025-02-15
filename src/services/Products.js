import { ProductRepository } from '../repositories/Products.js';
import { Product } from '../models/Product.js';

class ProductService {
	constructor() {
		this.productRepository = new ProductRepository();
	}

	async create(productData) {
		try {
			if (!productData) throw new Error('Produto inválido');
			const newProduct = new Product(productData);
			return await this.productRepository.create(newProduct);
		} catch (error) {
			throw new Error(`Erro ao criar produto: ${error.message}`);
		}
	}

	async findById(id) {
		try {
			if (!id) throw new Error('ID não fornecido');
			return await this.productRepository.findById(id);
		} catch (error) {
			throw new Error(`Erro ao buscar produto: ${error.message}`);
		}
	}

	async listAllProducts() {
		try {
			return await this.productRepository.listAllProducts();
		} catch (error) {
			throw new Error(`Erro ao listar produtos: ${error.message}`);
		}
	}

	async updateProduct(id, product) {
		try {
			if (!id || !product)
				throw new Error('ID ou dados do produto não fornecidos');
			return await this.productRepository.updateProduct(id, product);
		} catch (error) {
			throw new Error(`Erro ao atualizar produto: ${error.message}`);
		}
	}

	async updateProductPrice(id, price) {
		try {
			if (!id || price === undefined)
				throw new Error('ID ou preço não fornecidos');
			return await this.productRepository.updateProduct(id, { price });
		} catch (error) {
			throw new Error(`Erro ao atualizar preço: ${error.message}`);
		}
	}

	async updateProductStock(id, quantity) {
		try {
			if (!id || quantity === undefined)
				throw new Error('ID ou quantidade não fornecidos');
			return await this.productRepository.updateProduct(id, { quantity });
		} catch (error) {
			throw new Error(`Erro ao atualizar estoque: ${error.message}`);
		}
	}

	async checkProductStock(id) {
		try {
			if (!id) throw new Error('ID não fornecido');
			return await this.productRepository.checkProductStock(id);
		} catch (error) {
			throw new Error(`Erro ao verificar estoque: ${error.message}`);
		}
	}
}

export { ProductService };
