import { Router } from 'express';
import { ProductController } from '../controllers/Products.js';

const productRouter = Router();

const productController = new ProductController();

productRouter.post('/insert', productController.create);
productRouter.get('/list', productController.listAllProducts);
productRouter.get('/:id', productController.findById);
productRouter.put('/update/:id', productController.updateProduct);
productRouter.patch('/update/:id/price', productController.updateProductPrice);
productRouter.patch('/update/:id/stock', productController.updateProductStock);
productRouter.get('/:id/stock', productController.checkProductStock);

export { productRouter };
