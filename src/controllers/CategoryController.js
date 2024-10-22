import { CategoryValidator } from "../utils/CategoryValidator.js";
import { CategoryService } from "../services/CategoryService.js";
import Database from "../database/database.js";

const db = new Database().db;
const newCategory = new CategoryService();

class CategoryController { 
  async create(req, res) {
    try {
      const validationResult = CategoryValidator.validate(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const categoryId = await newCategory.create(req.body);
      res.status(201).json({ id: categoryId, message: 'Category created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export { CategoryController };