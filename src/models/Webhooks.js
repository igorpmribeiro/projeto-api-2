class Webhook {
	constructor(data = {}) {
		this.type = data.type;
		this.action = data.action;
		this.url = data.url;
	}
}

export { Webhook };
