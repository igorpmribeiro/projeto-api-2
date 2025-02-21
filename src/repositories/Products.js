import { db } from '../config/knexfile.js';

class ProductRepository {
	async create(product) {
		const { attributes, ...productData } = product;
		

		const productToSave = {
			...productData,
			dimensions: JSON.stringify(product.dimensions),
			images: JSON.stringify(product.images),
			categories: JSON.stringify(product.categories),
		};
	
		try {

			const [id] = await db('products').insert(productToSave);
	
			if (attributes && attributes.length > 0) {
				const productAttrToSave = attributes.map((attr) => {
					const { codref, ...filteredAttr } = attr;
					return {
						...filteredAttr,
						paoptionsids: JSON.stringify(attr.paoptionsids),
						products_id: id,
						products_options_id: product.attrGroupId 
					};
				});
				
				await db('products_attributes').insert(productAttrToSave);
			}

	
			return {
				...product,
				id,
			};
		} catch (error) {
			console.error("Erro ao inserir produto:", error);
			throw new Error("Erro ao salvar produto no banco de dados");
		}
	}
	

	async findById(id) {
		const product = await db('products').where({ id }).first();
		if (product) {
			return {
				...product,
				dimensions: JSON.parse(product.dimensions || '[]'),
				images: JSON.parse(product.images || '[]'),
				categories: JSON.parse(product.categories || '[]'),
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
