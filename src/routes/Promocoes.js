import { Router } from 'express';
import { PromocoesController } from '../controllers/Promocoes.js';

const promocoesRouter = Router();
const promocoesController = new PromocoesController();

promocoesRouter.post('/insert/', promocoesController.createPromotion);
promocoesRouter.get('/', promocoesController.getPromotions);
promocoesRouter.get('/:id', promocoesController.getPromotionById);

export { promocoesRouter };
