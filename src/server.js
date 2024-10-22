import express from 'express';
import Database from './database/database.js';
import { productRouter } from './routes/ProductRoutes.js';
import { categoryRouter } from './routes/CategoryRoutes.js';

const app = express();

app.use(express.json());

app.use('/ws/v2/products', productRouter);
app.user('/ws/v2/categories', categoryRouter);

const db = new Database();
db.init();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
} );