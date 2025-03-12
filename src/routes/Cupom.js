import { Router } from 'express';
import { CupomController } from '../controllers/Cupom.js';

const cupomRouter = Router();
const cupomController = new CupomController();

cupomRouter.post('/insert', cupomController.createCupom);

export { cupomRouter };