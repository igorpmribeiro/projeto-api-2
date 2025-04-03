import { PromocoesService } from '../services/Promocoes.js';
import { PromotionValidator } from '../validators/Promocoes.js';

class PromocoesController {
	constructor() {
		this.IPromocoesService = new PromocoesService();
		this.IPromotionValidator = new PromotionValidator();
	}
	createPromotion = async (req, res, next) => {
		const promotionData = req.body;
		try {
			const validationResult = this.IPromotionValidator.validate(promotionData);
			if (validationResult.errors.length > 0) {
				return res.status(400).json({ validationErrors: validationResult.errors });
			}
			const promotion = await this.IPromocoesService.createPromotion(promotionData);
			res.status(201).json({ message: 'Promoção criada com sucesso', promotion });
		} catch (error) {
			next(error);
		}
	};

	getPromotions = async (req, res, next) => {
		try {
			const promotions = await this.IPromocoesService.getPromotions();
			res.status(200).json(promotions);
		} catch (error) {
			next(error);
		}
	};

	getPromotionById = async (req, res, next) => {
		const { id } = req.params;
		try {
			const promotion = await this.IPromocoesService.getPromotionById(id);
			if (!promotion) {
				return res.status(404).json({ message: 'Promoção não encontrada' });
			}
			res.status(200).json(promotion);
		} catch (error) {
			next(error);
		}
	};
}

export { PromocoesController };
