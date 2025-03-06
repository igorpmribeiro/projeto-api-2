import express from 'express';
import rollbar from './config/rollbar.js';
import Database from './database/database.js';
import { productRouter } from './routes/Products.js';
import { categoryRouter } from './routes/Categories.js';
import { attributeRouter } from './routes/Attributes.js';
import { customersRouter } from './routes/Customers.js';
import { ordersRouter } from './routes/Orders.js';

import errorRouter from './routes/test.js';

const app = express();

app.use(express.json());
app.use(rollbar.errorHandler());

app.use('/ws/v2/products', productRouter);
app.use('/ws/v2/categories', categoryRouter);
app.use('/ws/v2/attributes', attributeRouter);
app.use('/ws/v2/customers', customersRouter);
app.use('/ws/v2/orders', ordersRouter);
app.use('/ws/v2/test', errorRouter);

app.use((err, req, res, next) => {
	rollbar.error(err, (err, uuid) => {
		res.status(500).json({ error: 'Ocorreu um erro no servidor', uuid });
	});
});

const db = new Database();
db.init();

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
