import { PromocoesRepository } from '../repositories/Promocoes.js';

class PromocoesService {
	constructor() {
		this.promocoesRepository = new PromocoesRepository();
	}

	async createPromotion(promotion) {
		return await this.promocoesRepository.createPromotion(promotion);
	}

	async getPromotions() {
		return await this.promocoesRepository.getPromotions();
	}

	async getPromotionById(id) {
		return await this.promocoesRepository.getPromotionById(id);
	}
}

export { PromocoesService };
