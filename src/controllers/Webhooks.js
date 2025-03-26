import { WebhookService } from '../services/Webhooks.js';

class WebhookController {
	constructor() {
		this.IWebhookService = new WebhookService();
	}
	async createWebhook(req, res, next) {
		try {
			const webhook = await this.IWebhookService.createWebhook(req.body);
			if (!webhook) {
				return res.status(400).json({ error: 'Invalid data' });
			}
			return res.status(201).json({ message: 'Webhook created successfully', webhook });
		} catch (error) {
			next(error);
		}
	}

	async getAllWebhooks(req, res, next) {
		try {
			const webhooks = await this.IWebhookService.getAllWebhooks();
			if (!webhooks) {
				return res.status(400).json({ error: 'Invalid data' });
			}
			return res.status(200).json({ webhooks: webhooks });
		} catch (error) {
			next(error);
		}
	}

	async deleteWebhook(req, res, next) {
		try {
			const { id } = req.params;
			const deletedWebhook = await this.IWebhookService.deleteWebhook(id);
			if (!deletedWebhook) {
				return res.status(400).json({ error: 'Invalid data' });
			}
			return res.status(200).json({ message: 'Webhook deleted successfully' });
		} catch (error) {
			next(error);
		}
	}
}

export { WebhookController };
