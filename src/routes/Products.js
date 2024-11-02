import { Router } from 'express';
import { ProductController } from '../controllers/Products.js';

const productRouter = Router();

const productController = new ProductController();

productRouter.post('/insert', productController.create);
productRouter.get('/:id', productController.findById);

export { productRouter };
