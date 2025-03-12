import { Router } from 'express';
import { FabricantesController } from '../controllers/Fabricantes.js';

const fabricantesRouter = Router();
const fabricantesController = new FabricantesController();

fabricantesRouter.post('/insert', fabricantesController.createFabricante);
fabricantesRouter.get('/', fabricantesController.getFabricantes);
fabricantesRouter.put('/update/:id', fabricantesController.updateFabricantes);

export { fabricantesRouter };
