import { Orders } from '../models/Orders.js';
import { OrdersRepository } from '../repositories/Orders.js';
import { CustomersRepository } from '../repositories/Customers.js';
import { ProductRepository } from '../repositories/Products.js';

class OrdersService {
	constructor() {
		this.ordersRepository = new OrdersRepository();
		this.customersRepository = new CustomersRepository();
		this.productsRepository = new ProductRepository();
	}

	async createOrder(orderData) {
		try {
			if (!orderData) throw new Error('Pedido inválido');

			const customer = await this.customersRepository.findById(
				orderData.customers_id,
			);
			if (!customer) throw new Error('Cliente não encontrado ou não informado');

			if (
				!orderData.products ||
				!Array.isArray(orderData.products) ||
				orderData.products.length === 0
			) {
				throw new Error('Produtos não fornecidos ou formato inválido');
			}

			for (const productItem of orderData.products) {
				if (!productItem.id) throw new Error('ID do produto não fornecido');
				if (!productItem.quantity) productItem.quantity = 1;

				const product = await this.productsRepository.findById(productItem.id);
				if (!product)
					throw new Error(`Produto com ID ${productItem.id} não encontrado`);
			}

			if (!orderData.orderTotal) {
				let total = 0;
				for (const productItem of orderData.products) {
					if (productItem.finalPrice) {
						total += productItem.finalPrice;
					} else {
						const product = await this.productsRepository.findById(
							productItem.id,
						);
						total += product.price * productItem.quantity;
					}
				}

				if (orderData.shipping?.cost) {
					total += orderData.shipping.cost;
				}

				orderData.orderTotal = total;
			}

			const newOrder = new Orders(orderData);
			return await this.ordersRepository.createOrder(newOrder);
		} catch (error) {
			throw new Error(`Erro ao criar pedido: ${error.message}`);
		}
	}
}

export { OrdersService };
