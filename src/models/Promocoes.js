class Promocoes {
	constructor(data = {}) {
		this.status = data.status || 0;
		this.product_id = data.product_id;
		this.special_price = data.special_price;
		this.schedule_date = data.schedule_date;
		this.expires_date = data.expires_date;
		this.groups = data.groups || [];
	}
}

export { Promocoes };
