import { PromocoesService } from '../services/Promocoes.js';
import { PromotionValidator } from '../validators/Promocoes.js';

const IPromotionValidator = new PromotionValidator();
const IPromocoesService = new PromocoesService();

class PromocoesController {
	async createPromotion(req, res, next) {
		const promotionData = req.body;
		try {
			const validationResult = IPromotionValidator.validate(promotionData);
			if (validationResult.errors.length > 0) {
				return res.status(400).json({ validationErrors: validationResult.errors });
			}
			const promotion = await IPromocoesService.createPromotion(promotionData);
			res.status(201).json({ message: 'Promoção criada com sucesso', promotion });
		} catch (error) {
			next(error);
		}
	}

	async getPromotions(req, res, next) {
		try {
			const promotions = await IPromocoesService.getPromotions();
			res.status(200).json(promotions);
		} catch (error) {
			next(error);
		}
	}

	async getPromotionById(req, res, next) {
		const { id } = req.params;
		try {
			const promotion = await IPromocoesService.getPromotionById(id);
			if (!promotion) {
				return res.status(404).json({ message: 'Promoção não encontrada' });
			}
			res.status(200).json(promotion);
		} catch (error) {
			next(error);
		}
	}
}

export { PromocoesController };
