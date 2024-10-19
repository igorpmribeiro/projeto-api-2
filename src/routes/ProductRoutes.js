import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';

const productRouter = Router();

const productController = new ProductController();

productRouter.post('/insert', productController.create);

export { productRouter };