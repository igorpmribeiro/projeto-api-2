import { Router } from 'express';
import { OrdersController } from '../controllers/Orders.js';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post('/insert', ordersController.createOrder);
ordersRouter.get('/list', ordersController.listOrders);

export { ordersRouter };
