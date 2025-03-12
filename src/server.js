import express from 'express';
import rollbar from './config/rollbar.js';
import { productRouter } from './routes/Products.js';
import { categoryRouter } from './routes/Categories.js';
import { attributeRouter } from './routes/Attributes.js';
import { customersRouter } from './routes/Customers.js';
import { ordersRouter } from './routes/Orders.js';
import { cupomRouter } from './routes/Cupom.js';
import { scriptRouter } from './routes/Script.js';
import { webhookRouter } from './routes/Webhooks.js';
import { fabricantesRouter } from './routes/Fabricantes.js';
import { promocoesRouter } from './routes/Promocoes.js';

import errorRouter from './routes/test.js';

const app = express();

app.use(express.json());
app.use(rollbar.errorHandler());

app.use('/ws/v2/products', productRouter);
app.use('/ws/v2/categories', categoryRouter);
app.use('/ws/v2/attributes', attributeRouter);
app.use('/ws/v2/customers', customersRouter);
app.use('/ws/v2/orders', ordersRouter);
app.use('/ws/v2/coupons', cupomRouter);
app.use('/ws/v2/scripts', scriptRouter);
app.use('/ws/v2/webhooks', webhookRouter);
app.use('/ws/v2/fabricantes', fabricantesRouter);
app.use('/ws/v2/promotions', promocoesRouter);
// app.use('/ws/v2/test', errorRouter);

app.use((err, req, res, next) => {
	rollbar.error(err, (err, uuid) => {
		res.status(500).json({ error: 'Ocorreu um erro no servidor', uuid });
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
