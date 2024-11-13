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
}

export { ProductController };
