import { OrdersService } from '../services/Orders.js';

const IOrdersService = new OrdersService();

class OrdersController {
    async createOrder(req, res, next) {
        try {
            const createdOrder = await IOrdersService.createOrder(req.body);
            return res.status(201).json({message: 'Pedido criado com sucesso', createdOrder});
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async listOrders(req, res, next) {
        try {
            const orders = await IOrdersService.listOrders();
            return res.status(200).json({orders});
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export { OrdersController };