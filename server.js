import express from 'express';
import Database from './src/database/database.js';
import { productRouter } from './src/routes/productRoutes.js';

const app = express();

app.use(express.json());

app.use('/ws/v2/products', productRouter);

const db = new Database();
db.init();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
} );