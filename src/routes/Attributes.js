import express from 'express';
import { AttributeController } from '../controllers/Attributes.js';

const attributeRouter = express.Router();

const attributesController = new AttributeController();

attributeRouter.post('/insert', attributesController.create);

export { attributeRouter };
