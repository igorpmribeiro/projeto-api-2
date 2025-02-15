import { CategoryRepository } from '../repositories/Categories.js';
import { Category } from '../models/Category.js';

class CategoryService {
	constructor() {
		this.categoryRepository = new CategoryRepository();
	}

	async create(categoryData) {
		const category = new Category(categoryData);
		const id = await this.categoryRepository.create(category);
		return id;
	}

	async findById(id) {
		const category = await this.categoryRepository.findById(id);
		return category ? new Category(category).toJSON() : null;
	}

	async updateCategory(id, categoryData) {
		const currentCategory = await this.findById(id);
		if (!currentCategory) {
			throw new Error('Category not found');
		}

		const updatedCategory = new Category({
			...currentCategory,
			...categoryData
		});

		return this.categoryRepository.update(id, updatedCategory);
	}

	async listAllCategories() {
		const categories = await this.categoryRepository.listAllCategories();
		return categories;
	}
}

export { CategoryService };
