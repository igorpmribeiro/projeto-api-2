import { db } from '../config/knexfile.js';

class PromocoesRepository {
	async createPromotion(promotion) {
		const [id] = await db('promotions').insert({
			status: promotion.status,
			product_id: promotion.product_id,
			special_price: promotion.special_price,
			schedule_date: promotion.schedule_date,
			expires_date: promotion.expires_date,
			groups: JSON.stringify(promotion.groups),
		});
		const createdPromotion = await db('promotions').where({ id }).first();
		return createdPromotion;
	}

	async getPromotions() {
		const promotions = await db('promotions').select(
			'id',
			'status',
			'schedule_date',
			'expires_date',
			'groups',
			'product_id',
			'special_price',
		);

		const products = await db('products')
			.select('id', 'price', 'name')
			.whereIn(
				'id',
				promotions.map((promotion) => promotion.product_id),
			);

		const result = promotions.map((promotion) => {
			const product = products.find(
				(product) => product.id === promotion.product_id,
			);

			// Handle case where product might not be found
			if (!product) {
				return {
					...promotion,
					product: null,
					price_from: null,
					price_to: promotion.special_price,
				};
			}

			return {
				id: promotion.id,
				status: promotion.status,
				product: {
					id: product.id,
					name: product.name,
				},
				schedule_date: promotion.schedule_date,
				expires_date: promotion.expires_date,
				price_from: product.price,
				price_to: promotion.special_price,
				groups: promotion.groups,
			};
		});

		return {
			status: 200,
			totalFound: result.length,
			result,
		};
	}

	async getPromotionById(id) {
		const { special_price, ...promotionData } = await db('promotions')
			.select(
				'id',
				'status',
				'schedule_date',
				'expires_date',
				'groups',
				'product_id',
				'special_price',
			)
			.where({ id })
			.first();
		const productData = await db('products')
			.select('id', 'price', 'name')
			.where({ id: promotionData.product_id })
			.first();

		// Handle case where product is not found
		if (!productData) {
			return {
				promotionData,
				product: null,
				price_from: null,
				price_to: special_price,
			};
		}

		return {
			promotionData,
			product: {
				id: productData.id,
				name: productData.name,
			},
			price_from: productData.price,
			price_to: special_price,
		};
	}
}

export { PromocoesRepository };
