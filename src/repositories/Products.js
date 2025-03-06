import { db } from '../config/knexfile.js';

class ProductRepository {
	async create(product) {
		const { categories, attributes, ...productData } = product;

		try {
			const [id] = await db('products').insert({
				...productData
			});

			if (categories && categories.length > 0 ) {
				await db('products_categories').insert(
					categories.map((category) => ({
						products_id: id,
						categories_id: category
					}))
				);
			}

			if (attributes && attributes.length > 0) {
				await db('products_attributes').insert(
					attributes.map((attribute) => ({
						products_id: id,
						products_options_id: attribute.attrGroupId,
						paativo: 1, 
						padefault: attribute.isDefault || 0,
						paprecodiff: attribute.priceDiff || '',
						papesodiff: attribute.weightDiff || '',
						paestoque: attribute.stock || 0,
						papreco: attribute.price || 0,
						papeso: attribute.weight || 0,
						pacodref: attribute.pacodref || attribute.codref || '',
						paoptionsids: JSON.stringify(attribute.optionsIds || []),
						paimagem: JSON.stringify(attribute.image || ''),
						padimensions: JSON.stringify(attribute.dimensions || [])
					}))
				);
			}
			
			return {
				...productData,
				id
			};
			
		} catch (error) {
			throw new Error(`Error creating product: ${error.message}`);
		}
	}
	

	async findById(id) {
		const product = await db('products').where({ id }).first();

		if (product) {
			const categories = await db('products_categories')
				.join('categories', 'products_categories.categories_id', '=', 'categories.id')
				.where({ 'products_categories.products_id': id })
				.select('categories.id', 'categories.name', 'categories.parent_id');

			return {
				...product,
				dimensions: JSON.parse(product.dimensions || '[]'),
				images: JSON.parse(product.images || '[]'),
				categories: categories.map(category => ({
					id: category.id,
					name: category.name,
					parent_id: category.parent_id || 0
				}))
			};
		}
		return product;
	}

	async listAllProducts() {
		const products = await db('products').select('*');
		return products.map((product) => ({
			...product,
			dimensions: JSON.parse(product.dimensions || '[]'),
			images: JSON.parse(product.images || '[]'),
			categories: JSON.parse(product.categories || '[]'),
		}));
	}

	async updateProduct(id, product) {
		const currentProduct = await this.findById(id);
		if (!currentProduct) {
			throw new Error('Product not found');
		}

		const updatedProduct = {
			name: product.name ?? currentProduct.name,
			price: product.price ?? currentProduct.price,
			quantity: product.quantity ?? currentProduct.quantity,
			description: product.description ?? currentProduct.description,
			codref: product.codref ?? currentProduct.codref,
			categories: product.categories ?? currentProduct.categories,
		};

		await db('products')
			.where({ id })
			.update({
				...updatedProduct,
				categories: JSON.stringify(updatedProduct.categories),
			});

		return updatedProduct;
	}

	async checkProductStock(id) {
		const product = await this.findById(id);
		return product ? product.quantity : 0;
	}

	async insertAttribute(id, attribute) {
		const product = await this.findById(id);
		if (!product) {
			throw new Error('Product not found');
		}

		const attributeToSave = {
			products_id: id,
			products_options_id: product.attrGroupId,
			paativo: 1, 
			padefault: attribute.isDefault || 0,
			paprecodiff: attribute.priceDiff || '',
			papesodiff: attribute.weightDiff || '',
			paestoque: attribute.stock || 0,
			papreco: attribute.price || 0,
			papeso: attribute.weight || 0,
			pacodref: attribute.pacodref || attribute.codref || '',
			paoptionsids: JSON.stringify(attribute.optionsIds || []),
			paimagem: JSON.stringify(attribute.image || ''),
			padimensions: JSON.stringify(attribute.dimensions || [])
		};

		await db('products_attributes').insert(attributeToSave);

		return attributeToSave;
	}
}

export { ProductRepository };
