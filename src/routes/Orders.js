import { Router } from 'express';
import { OrdersController } from '../controllers/Orders.js';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post('/insert', ordersController.createOrder);
ordersRouter.get('/list', ordersController.listOrders);
ordersRouter.get('/get/:id', ordersController.getOrders);
ordersRouter.put('/update/:id', ordersController.updateOrder);

export { ordersRouter };
