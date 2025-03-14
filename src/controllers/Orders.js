import { OrdersService } from '../services/Orders.js';
const IOrdersService = new OrdersService();

class OrdersController {
	async createOrder(req, res, next) {
		try {
			const createdOrder = await IOrdersService.createOrder(req.body);
			return res
				.status(201)
				.json({ message: 'Pedido criado com sucesso', createdOrder });
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	}

	async listOrders(req, res, next) {
		try {
			// Obtém o número da página do header da requisição
			const page = req.headers.page || 1;

			// Busca os pedidos com paginação
			const result = await IOrdersService.listOrders(page);

			// Define os headers de paginação na resposta
			res.set({
				'X-Total-Count': result.pagination.total,
				'X-Total-Pages': result.pagination.totalPages,
				'X-Current-Page': result.pagination.currentPage,
			});

			return res.status(200).json({
				orders: result.orders,
				pagination: result.pagination,
			});
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	}
}

export { OrdersController };
