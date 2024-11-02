class Product {
	constructor(id, name, price, quantity, description, codref, categories = []) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.description = description;
		this.categories = categories;
		this.codref = codref;
	}
}

export { Product };
