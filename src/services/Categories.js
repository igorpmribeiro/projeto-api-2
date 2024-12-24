import { CategoryRepository } from '../repositories/Categories.js';
import { Category } from '../models/Category.js';

class CategoryService {
	constructor() {
		this.categoryRepository = new CategoryRepository();
	}

	async create(category) {
		const newCategory = new Category(
			category.name,
			category.title,
			category.subtitle,
			category.hidden,
			category.discount,
			category.image,
		);

		return this.categoryRepository.create(newCategory);
	}

	async findById(id) {
		return await this.categoryRepository.findById(id);
	}

	async updateCategory(id, category) {
		const currentCategory = await this.findById(id);
		if (!currentCategory) {
			throw new Error('Category not found');
		}

		const updatedCategory = {
			name: category.name ?? currentCategory.name,
			title: category.title ?? currentCategory.title,
			subtitle: category.subtitle ?? currentCategory.subtitle,
			hidden: category.hidden ?? currentCategory.hidden,
			discount: category.discount ?? currentCategory.discount,
			image: category.image ?? currentCategory.image,
		};

		await this.categoryRepository.update(id, updatedCategory);

		return updatedCategory;
	}

	async listAllCategories() {
		return await this.categoryRepository.listAllCategories();
	}
}

export { CategoryService };
