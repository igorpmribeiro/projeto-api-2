import { Router } from 'express';
import { CustomersController } from '../controllers/Customers.js';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post('/insert', customersController.create);
customersRouter.post('/groups/insert', customersController.createGroup);
customersRouter.put('/update/:id', customersController.update);
customersRouter.post('/:id/address', customersController.insertAddress);
customersRouter.get('/:id/address', customersController.listAddress);

export { customersRouter };