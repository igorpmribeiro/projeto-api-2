import { Router } from 'express';
import { StatusController } from '../controllers/Status.js';

const IStatusController = new StatusController();
const statusRouter = Router();

statusRouter.get('/list', IStatusController.getStatus);
statusRouter.post('/insert', IStatusController.createStatus);
statusRouter.put('/update/:id', IStatusController.updateStatus);
statusRouter.delete('/delete/:id', IStatusController.deleteStatus);

export { statusRouter };
