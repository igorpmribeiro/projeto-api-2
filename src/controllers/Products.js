import { ProductService } from '../services/Products.js';
import { ProductValidator } from '../validators/Products.js';

class ProductController {
	constructor() {
		this.IProductService = new ProductService();
		this.IProductValidator = new ProductValidator();
	}
	create = async (req, res, next) => {
		try {
			const validationResult = this.IProductValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			const createdProduct = await this.IProductService.create(req.body);
			res.status(201).json({
				message: 'Produto criado com sucesso',
				ProductID: createdProduct.id,
				Name: createdProduct.name,
			});
		} catch (error) {
			next(error);
		}
	};

	findById = async (req, res, next) => {
		try {
			const productId = await this.IProductService.findById(req.params.id);
			if (!productId) {
				return res.status(404).json({ error: 'Product not found' });
			}

			res.json(productId);
		} catch (error) {
			next(error);
		}
	};

	listAllProducts = async (req, res) => {
		try {
			const products = await this.IProductService.listAllProducts();
			res.json(products);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	};

	updateProduct = async (req, res, next) => {
		try {
			const validationResult = this.IProductValidator.validateUpdate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			await this.IProductService.updateProduct(req.params.id, req.body);
			res.json({ message: 'Product updated' });
		} catch (error) {
			next(error);
		}
	};

	checkProductPrice = async (req, res, next) => {
		try {
			const product = await this.IProductService.findById(req.params.id);
			if (!product) {
				return res.status(404).json({ error: 'Product not found' });
			}

			res.status(200).json({ id: req.params.id, price: product.price });
		} catch (error) {
			next(error);
		}
	};

	updateProductPrice = async (req, res, next) => {
		try {
			await this.IProductService.updateProduct(req.params.id, req.body);
			res.json({ message: 'Product price updated' });
		} catch (error) {
			next(error);
		}
	};

	updateProductStock = async (req, res, next) => {
		try {
			await this.IProductService.updateProduct(req.params.id, req.body);
			res.status(200).json({ message: 'Product stock updated' });
		} catch (error) {
			next(error);
		}
	};

	checkProductStock = async (req, res, next) => {
		try {
			const stock = await this.IProductService.checkProductStock(req.params.id);
			res.status(200).json({ id: req.params.id, stock: stock });
		} catch (error) {
			next(error)
		}
	};

	insertAttribute = async (req, res, next) => {
		try {
			await this.IProductService.insertAttribute(req.params.id, req.body);
			res.status(200).json({ message: 'Attribute inserted' });
		} catch (error) {
			next(error);
		}
	};

	getProductAttributes = async (req, res, next) => {
		try {
			const attributes = await this.IProductService.getProductAttributes(req.params.id);

			if (!attributes || attributes.length === 0) {
				return res.status(404).json({ status: 404, message: 'No attributes found for this product' });
			}


			res.status(200).json({ status: 200, totalCount: attributes.length, result: attributes  });
		} catch (error) {
			next(error);
		}
	};
}

export { ProductController };
