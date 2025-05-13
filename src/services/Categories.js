import { CategoryRepository } from '../repositories/Categories.js';
import { Category } from '../models/Category.js';
import {CacheService} from "./CacheService.js";

class CategoryService {
	constructor() {
		this.categoryRepository = new CategoryRepository();
		this.cacheService = new CacheService();
	}

	async cre(categoryData) {
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
		const cacheKey = 'categories';
		const cachedCategories = await this.cacheService.get(cacheKey);
		if (cachedCategories) {
			return cachedCategories;
		}

		try {
			const categories = await this.categoryRepository.listAllCategories();
			if (categories.length > 0) {
				await this.cacheService.set(cacheKey, categories);
			}
			return categories;
		} catch (error) {
			throw new Error('Failed to fetch categories');
		}
	}
}

export { CategoryService };
