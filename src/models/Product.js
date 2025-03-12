class Product {
	constructor(data = {}) {
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
		this.attrGroupId = data.attrGroupId;
		this.attrType = data.attrType;
		this.attributes = data.attributes
			? data.attributes.map((attr) => new ProductAttributes(attr))
			: [];
	}
}
class ProductAttributes {
	constructor(data = {}) {
		this.paativo = 1;
		this.padefault = data.isDefault;
		this.pacodref = data.codref;
		this.paestoque = data.stock;
		this.paprecodiff = data.priceDiff;
		this.papreco = data.price;
		this.papeso = data.weight;
		this.papesodiff = data.weightDiff;
		this.optionsIds = data.optionsIds || [];
		this.paimagem = data.image;
		this.padimensions = data.dimensions;
	}
}
export { Product, ProductAttributes };
