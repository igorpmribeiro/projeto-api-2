import { Promocoes } from '../models/Promocoes.js';
import { PromocoesRepository } from '../repositories/Promocoes.js';

const IPromocoesRepository = new PromocoesRepository();

class PromocoesService {
	async createPromotion(promotion) {
		return await IPromocoesRepository.createPromotion(promotion);
	}

	async getPromotions(page = 1) {
		const pageNumber = Math.max(1, Number.parseInt(page) || 1);
		const limit = 10;

		const result = await IPromocoesRepository.listPromotions(pageNumber, limit);

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
		return await this.promocoesRepository.getPromotionById(id);
	}
}

export { PromocoesService };
