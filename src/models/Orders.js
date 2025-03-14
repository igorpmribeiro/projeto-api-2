class Orders {
	constructor(data = {}) {
		this.id = data.id;
		this.origin = data.origin;
		this.orders_status = data.status;
		this.date_purchased = data.datePurchased || new Date();
		this.order_total = data.orderTotal;
		this.customers_id = data.customers_id;

		// Only include shipping and payment when they exist in data
		if (data.shipping) {
			this.shipping = new OrdersShipping(data.shipping);
		}

		if (data.payment) {
			this.payment = new OrdersPayment(data.payment);
		}

		this.products = data.products
			? data.products.map((product) => new OrdersProducts(product))
			: [];
	}
}

class OrdersShipping {
	constructor(data = {}) {
		// Include shipping properties directly
		this.shipping_method = data.shipping_method;
		this.shipping_cost = data.shipping_cost;

		// Include address directly when it exists
		if (data.address) {
			this.address = data.address;
		}
	}
}

class OrdersPayment {
	constructor(data = {}) {
		this.payment_method = data.payment_method;
		this.payment_n_parcelas = data.payment_n_parcelas;
	}
}

class OrdersProducts {
	constructor(data = {}) {
		this.id = data.id;
		this.quantity = data.quantity || 1;
		this.unitPrice = data.unitPrice;
		this.finalPrice = data.finalPrice;
		this.giftWrap = data.giftWrap;
		this.isFree = data.isFree;
		this.attrId = data.attrId;
	}
}

export { Orders };
