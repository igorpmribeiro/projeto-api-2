class Category {
	constructor(data = {}) {
		this.id = data.id;
		this.name = data.name;
		this.subtitle = data.subtitle;
		this.discount = data.discount || 0;
		this.hidden = data.hidden;
		this.parent_id = data.parent_id;
		this.sort_order = data.sort_order;
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			subtitle: this.subtitle,
			discount: this.discount,
			hidden: this.hidden,
			parent_id: this.parent_id,
			sort_order: this.sort_order
		};
	}
}

export { Category };