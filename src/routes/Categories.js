import { Router } from 'express';
import { CategoryController } from '../controllers/Categories.js';

const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post('/insert', categoryController.create);
categoryRouter.get('/list', categoryController.listAllCategories);
categoryRouter.get('/:id', categoryController.findById);
categoryRouter.put('/update/:id', categoryController.updateCategory);

export { categoryRouter };
