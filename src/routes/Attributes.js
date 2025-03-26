import { Router } from 'express';
import { AttributeController } from '../controllers/Attributes.js';

const attributeRouter = Router();

const attributesController = new AttributeController();

attributeRouter.post('/insert', attributesController.create);
attributeRouter.get('/groups', attributesController.getGroups);
attributeRouter.get('/groups/:id', attributesController.findGroupValues);
// attributeRouter.put('/update/:id', attributesController.update);

export { attributeRouter };
