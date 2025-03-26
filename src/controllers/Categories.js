import { CategoryService } from '../services/Categories.js';
import { CategoryValidator } from '../validators/Categories.js';

class CategoryController {
	constructor() {
		this.ICategoryService = new CategoryService();
		this.ICategoryValidator = new CategoryValidator();
	}
	async create(req, res) {
		try {
			const validationResult = this.ICategoryValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			const id = await this.ICategoryService.create(req.body);
			const category = await this.ICategoryService.findById(id);

			res.status(201).json({
				status: 201,
				message: 'Category created successfully',
				category: category,
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async findById(req, res) {
		try {
			const category = await this.ICategoryService.findById(req.params.id);

			if (!category) {
				return res.status(404).json({ message: 'Category not found' });
			}
			res.status(200).json(category);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async updateCategory(req, res) {
		try {
			const updatedCategory = await this.ICategoryService.updateCategory(req.params.id, req.body);

			res.status(200).json({ message: 'Category updated', updatedCategory });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async listAllCategories(req, res) {
		try {
			const categories = await this.ICategoryService.listAllCategories();
			res.status(200).json({
				status: 200,
				response: categories,
			});
		} catch (error) {
			res.status(500).json({
				status: 500,
				error: error.message,
			});
		}
	}
}

export { CategoryController };
