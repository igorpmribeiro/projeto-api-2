import { OrdersService } from '../services/Orders.js';

import { OrderValidator } from '../validators/Order.js';

const IOrdersValidator = new OrderValidator();
const IOrdersService = new OrdersService();

class OrdersController {
	async createOrder(req, res, next) {
		try {
			const validationErrors = IOrdersValidator.validate(req.body);
			if (validationErrors) {
				return res.status(400).json({ errors: validationErrors });
			}
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

	async getOrders(req, res, next) {
		try {
			const id = req.params.id;
			if (!id) {
				return res.status(400).json({ error: 'Please provide an order ID' });
			}
			const order = await IOrdersService.getOrders(id);
			if (!order || order.length === 0) {
				return res.status(404).json({ error: 'Order ID not found' });
			}
			return res.status(200).json({ status: 200, order_id: id, order });
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	}

	async updateOrder(req, res, next) {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'Please provide an order ID' });
		}
		try {
			const updateData = req.body;

			const updateOrder = await IOrdersService.updateOrder(id, updateData);
			return res.status(200).json({
				message: 'Order updated successfully',
				order_id: id,
				updateOrder,
			});
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	}

	async cancelOrder(req, res, next) {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'Please provide an order ID' });
		}
		try {
			await IOrdersService.cancelOrder(id);
			return res.status(200).json({
				message: 'Order cancelled successfully',
				order_id: id,
			});
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	}
}

export { OrdersController };
