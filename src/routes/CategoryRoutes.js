import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';

const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post('/insert', categoryController.create);

export { categoryRouter };