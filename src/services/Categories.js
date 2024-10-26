import { CategoryRepository } from '../repositories/Categories.js';
import { Category } from '../models/Category.js';

class CategoryService {
	constructor() {
		this.categoryRepository = new CategoryRepository();
	}

	async create(category) {
		const newCategory = new Category(
			category.name,
			category.subtitle,
			category.hidden,
			category.discount,
			category.image,
		);

		return this.categoryRepository.create(newCategory);
	}
}

export { CategoryService };
