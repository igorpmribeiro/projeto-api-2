import { WebhookRepository } from '../repositories/Webhooks.js';
import { Webhook } from '../models/Webhooks.js';

class WebhookService {
	constructor() {
		this.IWebhookRepository = new WebhookRepository();
	}

	async createWebhook(webhook) {
		const newWebhook = new Webhook(webhook);
		const id = await this.IWebhookRepository.createWebhook(newWebhook);
		return id;
	}

	async getAllWebhooks() {
		const webhooks = await this.IWebhookRepository.getAllWebhooks();
		return webhooks;
	}

	async deleteWebhook(id) {
		const deleteWebhook = await this.IWebhookRepository.deleteWebhook(id);
		if (!deleteWebhook) {
			throw new Error('Webhook not found');
		}
		return deleteWebhook;
	}
}

export { WebhookService };
