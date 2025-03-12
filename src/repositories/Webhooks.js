import { db } from '../config/knexfile.js';

class WebhookRepository {
	async createWebhook(webhook) {
		const [id] = await db('webhooks').insert({
			webhook_type: webhook.type,
			webhook_action: webhook.action,
			webhook_url: webhook.url,
		});
		const createdWebhooks = await db('webhooks').where({ id }).first();
		return createdWebhooks;
	}

	async getAllWebhooks() {
		const webhooks = await db('webhooks').select('*');
		return webhooks;
	}

	async deleteWebhook(id) {
		const deletedWebhook = await db('webhooks').delete().where({ id: id });
		if (deletedWebhook) {
			return deletedWebhook;
		}
		throw new Error('Webhook not found');
	}
}

export { WebhookRepository };
