import { Router } from 'express';
import { WebhookController } from '../controllers/Webhooks.js';

const webhookRouter = Router();
const webhookController = new WebhookController();

webhookRouter.post('/insert', webhookController.createWebhook);
webhookRouter.get('/', webhookController.getAllWebhooks);
webhookRouter.delete('/delete/:id', webhookController.deleteWebhook);

export { webhookRouter };
