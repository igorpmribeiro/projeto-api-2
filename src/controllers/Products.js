import { ProductService } from '../services/Products.js';

import { ProductValidator } from '../validators/Products.js';
const IProductService = new ProductService();
const IProductValidator = new ProductValidator();

class ProductController {
	async create(req, res, next) {
		try {
			const validationResult = IProductValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			await IProductService.create(req.body);
			res.status(201).json({ message: 'Produto criado com sucesso' });
		} catch (error) {
			next(error);
		}
	}

	async findById(req, res, next) {
		try {
			const productId = await IProductService.findById(req.params.id);
			if (!productId) {
				return res.status(404).json({ error: 'Product not found' });
			}

			res.json(productId);
		} catch (error) {
			next(error);
		}
	}

	async listAllProducts(req, res) {
		try {
			const products = await IProductService.listAllProducts();
			res.json(products);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async updateProduct(req, res, next) {
		try {
			const validationResult = IProductValidator.validateUpdate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			await IProductService.updateProduct(req.params.id, req.body);
			res.json({ message: 'Product updated' });
		} catch (error) {
			next(error);
		}
	}

	async updateProductPrice(req, res, next) {
		try {
			await IProductService.updateProduct(req.params.id, req.body);
			res.json({ message: 'Product price updated' });
		} catch (error) {
			next(error);
		}
	}

	async updateProductStock(req, res, next) {
		try {
			await IProductService.updateProduct(req.params.id, req.body);
			res.status(200).json({ message: 'Product stock updated' });
		} catch (error) {
			next(error);
		}
	}

	async checkProductStock(req, res, next) {
		try {
			const stock = await IProductService.checkProductStock(req.params.id);
			res.status(200).json({ id: req.params.id, stock: stock });
		} catch (error) {
			next(error);
		}
	}

	async insertAttribute(req, res, next) {
		try {
			await IProductService.insertAttribute(req.params.id, req.body);
			res.status(200).json({ message: 'Attribute inserted' });
		} catch (error) {
			next(error);
		}
	}
}

export { ProductController };
