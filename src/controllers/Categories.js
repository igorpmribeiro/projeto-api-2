import { CategoryService } from '../services/Categories.js';
import Database from '../database/database.js';
import { CategoryValidator } from '../validators/Categories.js';

const db = new Database().db;
const categoryService = new CategoryService();
const categoryValidator = new CategoryValidator();

class CategoryController {
	async create(req, res) {
		try {
			const validationResult = categoryValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			const categoryId = await categoryService.create(req.body);
			res
				.status(201)
				.json({ id: categoryId, message: 'Category created successfully' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async findById(req, res) {
		try {
			const category = await categoryService.findById(req.params.id);

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
			const updatedCategory = await categoryService.updateCategory(
				req.params.id,
				req.body,
			);

			res.status(200).json({ message: 'Categoru updated', updatedCategory });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async listAllCategories(req, res) {
		try {
			const categories = await categoryService.listAllCategories();
			res.status(200).json(categories);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

export { CategoryController };
