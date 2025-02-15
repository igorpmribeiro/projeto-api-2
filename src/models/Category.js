class Category {
	constructor(data = {}) {
		this.name = data.name;
		this.subtitle = data.subtitle;
		this.discount = data.discount;
		this.hidden = data.hidden;
		this.parent_id = data.parent_id;
		this.sort_order = data.sort_order;
	}
}

export { Category };