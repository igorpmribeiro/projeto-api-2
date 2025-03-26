import { Promocoes } from '../models/Promocoes.js';
import { PromocoesRepository } from '../repositories/Promocoes.js';

class PromocoesService {
	constructor() {
		this.IPromocoesRepository = new PromocoesRepository();
	}
	async createPromotion(promotion) {
		return await this.IPromocoesRepository.createPromotion(promotion);
	}

	async getPromotions(page = 1) {
		const pageNumber = Math.max(1, Number.parseInt(page) || 1);
		const limit = 10;

		const result = await this.IPromocoesRepository.listPromotions(pageNumber, limit);

		return {
			pagination: {
				total: result.total,
				totalPages: Math.ceil(result.total / limit),
				currentPage: pageNumber,
			},
			promotions: result.promotions.map((promotion) => new Promocoes(promotion)),
		};
	}

	async getPromotionById(id) {
		return await this.IPromocoesRepository.getPromotionById(id);
	}
}

export { PromocoesService };
