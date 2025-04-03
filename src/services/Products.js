import { ProductRepository } from '../repositories/Products.js';
import { Product } from '../models/Product.js';
import { CacheService } from './CacheService.js';

class ProductService {
	constructor() {
		this.productRepository = new ProductRepository();
		this.cacheService = new CacheService();
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
		const cacheKey = 'allProducts';
		const cachedProducts = await this.cacheService.get(cacheKey);
		if (cachedProducts) {
			return cachedProducts;
		}

		const products = await this.productRepository.listAllProducts();
		await this.cacheService.set(cacheKey, products);
		return products;
	}

	async updateProduct(id, product) {
		try {
			if (!id || !product) throw new Error('ID ou dados do produto não fornecidos');
			return await this.productRepository.updateProduct(id, product);
		} catch (error) {
			throw new Error(`Erro ao atualizar produto: ${error.message}`);
		}
	}

	async updateProductPrice(id, price) {
		try {
			if (!id || price === undefined) throw new Error('ID ou preço não fornecidos');
			return await this.productRepository.updateProduct(id, { price });
		} catch (error) {
			throw new Error(`Erro ao atualizar preço: ${error.message}`);
		}
	}

	async checkProductPrice(id) {
		try {
			if (!id) throw new Error('ID não fornecido');
			return await this.productRepository.checkProductPrice(id);
		} catch (error) {
			throw new Error(`Erro ao verificar preço: ${error.message}`);
		}
	}

	async updateProductStock(id, quantity) {
		try {
			if (!id || quantity === undefined) throw new Error('ID ou quantidade não fornecidos');
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

	async insertAttribute(id, attribute) {
		try {
			if (!id || !attribute) throw new Error('Produto não encontrado');
			return await this.productRepository.insertAttribute(id, attribute);
		} catch (error) {
			throw new Error(`Erro ao inserir atributo: ${error.message}`);
		}
	}

	async getProductAttributes(id) {
		try {
			if (!id) throw new Error('ID não fornecido');
			return await this.productRepository.getProductAttributes(id);
		} catch (error) {
			throw new Error(`Erro ao buscar atributos do produto: ${error.message}`);
		}
	}
}

export { ProductService };
