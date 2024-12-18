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
}

export { CategoryController };
