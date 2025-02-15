class Product {
	constructor(data = {}) {
		this.id = data.id || null;
		this.name = data.name;
		this.price = data.price;
		this.quantity = data.quantity;
		this.check_stock = data.check_stock;
		this.weight = data.weight;
		this.dimensions = data.dimensions || [];
		this.quantity_critical = data.quantity_critical;
		this.description_full = data.description_full;
		this.small_description = data.small_description;
		this.images = data.images || [];
		this.codref = data.codref;
		this.categories = data.categories || [];
	}
}

export { Product };
