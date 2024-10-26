import { Router } from 'express';
import { CategoryController } from '../controllers/Categories.js';

const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post('/insert', categoryController.create);

export { categoryRouter };
