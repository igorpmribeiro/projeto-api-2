import express from 'express';
import { AttributeController } from '../controllers/Attributes.js';

const attributeRouter = express.Router();

const attributesController = new AttributeController();

attributeRouter.post('/insert', attributesController.create);
attributeRouter.get('/groups', attributesController.getGroups);
attributeRouter.get('/groups/:id', attributesController.findGroupValues);

export { attributeRouter };
