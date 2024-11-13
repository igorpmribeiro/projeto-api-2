import { Router } from 'express';
import { ProductController } from '../controllers/Products.js';

const productRouter = Router();

const productController = new ProductController();

productRouter.post('/insert', productController.create);
productRouter.get('/list', productController.listAllProducts);
productRouter.get('/:id', productController.findById);
productRouter.put('/update/:id', productController.updateProduct);

export { productRouter };
