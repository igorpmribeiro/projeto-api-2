import { db } from '../config/knexfile.js';

class OrdersRepository {
	async createOrder(order) {
		const { products, ...orderData } = order;

		try {
			const orderToInsert = {
				origin: order.origin,
				orders_status: order.orders_status,
				date_purchased:
					order.date_purchased || new Date().toISOString().split('T')[0],
				order_total: order.order_total,
				customers_id: order.customers_id,
				payment_method: order.payment?.payment_method,
				payment_n_parcelas: order.payment?.payment_n_parcelas || 1,
				shipping_method: order.shipping?.shipping_method,
				shipping_cost: order.shipping?.shipping_cost,
				customers_company: order.shipping?.address?.customers_company,
				customers_firstname: order.shipping?.address?.customers_firstname,
				customers_lastname: order.shipping?.address?.customers_lastname,
				customers_postcode: order.shipping?.address?.customers_postcode,
				customers_street_address:
					order.shipping?.address?.customers_street_address,
				customers_street_number:
					order.shipping?.address?.customers_street_number,
				customers_street_complemento:
					order.shipping?.address?.customers_street_complemento,
				customers_suburb: order.shipping?.address?.customers_suburb,
				customers_city: order.shipping?.address?.customers_city,
				customers_state: order.shipping?.address?.customers_state,
			};

			const [orderId] = await db('orders').insert(orderToInsert);

			if (products && products.length > 0) {
				const productsInsertPromises = products.map(async (product) => {
					const productDetails = await db('products')
						.where({ id: product.id })
						.first();

					if (!productDetails) {
						throw new Error(`Produto com ID ${product.id} não encontrado`);
					}

					// Se o usuário já forneceu preços específicos, use-os
					const productPrice = product.unitPrice || productDetails.price;
					const finalPrice =
						product.finalPrice || productPrice * product.quantity;

					// Montando objeto com todos os dados do produto para a tabela orders_products
					const orderProduct = {
						orders_id: orderId,
						products_id: product.id,
						products_quantity: product.quantity,
						products_price: productPrice,
						final_price: finalPrice,
						products_name: productDetails.name,
						products_weight: productDetails.weight || 0,
						products_cod_ref: productDetails.codref || '',
						products_dimensions: productDetails.dimensions
							? JSON.stringify(productDetails.dimensions)
							: '[]',
					};

					const [orderProductId] =
						await db('orders_products').insert(orderProduct);

					if (product.attrId) {
						const productAttribute = await db('products_attributes')
							.where({ paid: product.attrId })
							.first();

						if (productAttribute?.paoptionsids) {
							let optionIds = [];
							try {
								// Tentar parsear como JSON primeiro
								optionIds = JSON.parse(productAttribute.paoptionsids);
							} catch (e) {
								// Se falhar, tentar como string separada por vírgula
								optionIds = String(productAttribute.paoptionsids)
									.replace('[', '')
									.replace(']', '')
									.split(',')
									.map((id) => Number.parseInt(id.trim()))
									.filter((id) => !Number.isNaN(id));
							}

							if (optionIds.length > 0) {
								const attributeOptions = await db('attribute_options')
									.whereIn('id', optionIds)
									.select('id', 'type', 'name', 'value', 'attribute_id');

								for (const option of attributeOptions) {
									await db('orders_products_attributes').insert({
										orders_id: orderId,
										orders_products_id: orderProductId,
										products_options: option.name,
										products_options_values: option.value,
										products_options_id: option.attribute_id,
										products_options_type: option.type || 0,
									});
								}
							}
						}
					}

					return orderProductId;
				});

				await Promise.all(productsInsertPromises);
			}

			return {
				id: orderId,
				...orderData,
			};
		} catch (error) {
			throw new Error(`Error creating order: ${error.message}`);
		}
	}

	async listOrders(page = 1, limit = 20) {
		try {
			const offset = (page - 1) * limit;

			// Fetch orders with pagination
			const orders = await db('orders')
				.select('*')
				.orderBy('orders_id', 'desc')
				.limit(limit)
				.offset(offset);

			// Count total orders for pagination info
			const [{ count }] = await db('orders').count('* as count');

			return {
				orders: orders.map(this._mapOrderData),
				pagination: {
					total: Number(count),
					currentPage: page,
					limit,
					totalPages: Math.ceil(Number(count) / limit),
				},
			};
		} catch (error) {
			throw new Error(`Error listing orders: ${error.message}`);
		}
	}

	// Helper method to map order data consistently
	_mapOrderData(order) {
		// Base order object with required fields
		const orderObj = {
			id: order.orders_id,
			origin: order.origin,
			status: order.orders_status,
			datePurchased: order.date_purchased,
			orderTotal: order.order_total,
			customers_id: order.customers_id,
			products: [],
		};

		// Build shipping object with non-null values
		const shippingFields = {
			shipping_method: order.shipping_method,
			shipping_cost: order.shipping_cost,
		};

		// Filter out null values
		const shippingData = Object.fromEntries(
			Object.entries(shippingFields).filter(([_, value]) => value != null),
		);

		// Build address object with non-null values
		const addressFields = {
			customers_company: order.customers_company,
			customers_firstname: order.customers_firstname,
			customers_lastname: order.customers_lastname,
			customers_postcode: order.customers_postcode,
			customers_street_address: order.customers_street_address,
			customers_street_number: order.customers_street_number,
			customers_street_complemento: order.customers_street_complemento,
			customers_suburb: order.customers_suburb,
			customers_city: order.customers_city,
			customers_state: order.customers_state,
		};

		// Filter out null values
		const addressData = Object.fromEntries(
			Object.entries(addressFields).filter(([_, value]) => value != null),
		);

		// Only add address if we have address data
		if (Object.keys(addressData).length > 0) {
			shippingData.address = addressData;
		}

		// Only add shipping if we have shipping data
		if (Object.keys(shippingData).length > 0) {
			orderObj.shipping = shippingData;
		}

		// Build payment object with non-null values
		const paymentFields = {
			payment_method: order.payment_method,
			payment_n_parcelas: order.payment_n_parcelas,
		};

		// Filter out null values
		const paymentData = Object.fromEntries(
			Object.entries(paymentFields).filter(([_, value]) => value != null),
		);

		// Only add payment if we have payment data
		if (Object.keys(paymentData).length > 0) {
			orderObj.payment = paymentData;
		}

		return orderObj;
	}

	async getOrders(id) {
		try {
			const order = await db('orders')
				.select('*')
				.where({ orders_id: id })
				.first();

			return order;
		} catch (error) {
			throw new Error(`Error fetching orders: ${error.message}`);
		}
	}

	async updateOrder(id, updatedData) {
		const updatedOrder = await db('orders')
			.where({ orders_id: id })
			.update(updatedData);

		if (!updatedOrder) {
			throw new Error(`Order with ID ${id} not found`);
		}

		return await db('orders')
			.where({ orders_id: id })
			.select('status_id', 'nfe', 'track_code');
	}

	async cancelOrder(id) {
		const idCancel = await db('orders_status')
			.where({ title: 'Cancelado' })
			.select('id');

		const cancelledOrder = await db('orders')
			.where({ orders_id: id })
			.update({ status_id: idCancel[0].id });
		if (!cancelledOrder) {
			throw new Error(`Order with ID ${id} not found`);
		}
		return cancelledOrder;
	}
}

export { OrdersRepository };
