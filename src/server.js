import express from 'express';
import Database from './database/database.js';
import { productRouter } from './routes/ProductRoutes.js';
import { categoryRouter } from './routes/CategoryRoutes.js';
import { attributeRouter } from './routes/AttributeRoutes.js';

const app = express();

app.use(express.json());

app.use('/ws/v2/products', productRouter);
app.use('/ws/v2/categories', categoryRouter);
app.use('/ws/v2/attributes', attributeRouter);

const db = new Database();
db.init();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
} );