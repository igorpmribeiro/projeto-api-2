import { ProductService } from '../services/Products.js';

import Database from '../database/database.js';
import { ProductValidator } from '../validators/Products.js';
const db = new Database().db;
const newProduct = new ProductService();
const validator = new ProductValidator();

class ProductController {
	async create(req, res) {
		try {
			const validationResult = validator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			const productId = await newProduct.create(req.body);
			res.status(201).json({ id: productId });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async findById(req, res) {
		try {
			const productId = await newProduct.findById(req.params.id);
			if (!productId) {
				return res.status(404).json({ error: 'Product not found' });
			}

			res.json(productId);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async listAllProducts(req, res) {
		try {
			const products = await newProduct.listAllProducts();
			res.json(products);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

export { ProductController };
