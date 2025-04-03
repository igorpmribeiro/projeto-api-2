import { OrdersService } from '../services/Orders.js';
import { OrderValidator } from '../validators/Order.js';

class OrdersController {
	constructor() {
		this.IOrdersService = new OrdersService();
		this.IOrdersValidator = new OrderValidator();
	}
	createOrder = async (req, res, next) => {
		try {
			const validationErrors = this.IOrdersValidator.validate(req.body);
			if (validationErrors) {
				return res.status(400).json({ errors: validationErrors });
			}
			const createdOrder = await this.IOrdersService.createOrder(req.body);
			return res.status(201).json({ message: 'Pedido criado com sucesso', createdOrder });
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	};

	listOrders = async (req, res, next) => {
		try {
			// Obtém o número da página do header da requisição
			const page = req.headers.page || 1;

			// Busca os pedidos com paginação
			const result = await this.IOrdersService.listOrders(page);

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
	};

	getOrders = async (req, res, next) => {
		try {
			const id = req.params.id;
			if (!id) {
				return res.status(400).json({ error: 'Please provide an order ID' });
			}
			const order = await this.IOrdersService.getOrders(id);
			if (!order || order.length === 0) {
				return res.status(404).json({ error: 'Order ID not found' });
			}
			return res.status(200).json({ status: 200, order_id: id, order });
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	};

	updateOrder = async (req, res, next) => {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'Please provide an order ID' });
		}
		try {
			const updateData = req.body;

			const updateOrder = await this.IOrdersService.updateOrder(id, updateData);
			return res.status(200).json({
				message: 'Order updated successfully',
				order_id: id,
				updateOrder,
			});
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	};

	cancelOrder = async (req, res, next) => {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'Please provide an order ID' });
		}
		try {
			await this.IOrdersService.cancelOrder(id);
			return res.status(200).json({
				message: 'Order cancelled successfully',
				order_id: id,
			});
		} catch (error) {
			next(error);
			return res.status(500).json({ error: error.message });
		}
	};
}

export { OrdersController };
