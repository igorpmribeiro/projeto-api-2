import Database from '../database/database.js';
import { db } from '../config/knexfile.js';

class CategoryRepository {
    async create(category) {
        const [categoryId] = await db('categories').insert(category);
        return categoryId;
    }

    async findById(id) {
        const category = await db('categories').where({ id }).first();
        return category;
    }

    async update(id, category) {
        await db('categories').where({ id }).update({
            name: category.name,
            subtitle: category.subtitle,
            hidden: category.hidden,
            discount: category.discount,
            parent_id: category.parent_id,
            sort_order: category.sort_order
        });

        return await this.findById(id);
    }

    buildCategoryTree(categories, parentId = null, level = 1) {
        const result = {};
        
        // Get direct children of current parent
        const children = categories.filter(cat => cat.parent_id === parentId);
        
        children.forEach(category => {
            // Create category object with current level
            const categoryNode = {
                id: category.id,
                name: category.name,
                level: level,
                parent_id: category.parent_id || 0,
                subCategories: {}
            };
            
            // Recursively get subcategories
            const subCategories = this.buildCategoryTree(categories, category.id, level + 1);
            
            // Only add subCategories if there are any
            if (Object.keys(subCategories).length > 0) {
                categoryNode.subCategories = subCategories;
            }
            
            result[category.id] = categoryNode;
        });
        
        return result;
    }

    async listAllCategories() {
        const categories = await db('categories')
            .select('*')
            .orderBy(['parent_id', 'sort_order']);

        return this.buildCategoryTree(categories);
    }
}

export { CategoryRepository };
