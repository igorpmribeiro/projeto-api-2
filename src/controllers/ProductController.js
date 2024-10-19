import { ProductService } from "../services/ProductService.js";
import { ProductValidator } from "../utils/ProductValidator.js";
import Database from "../database/database.js";

const db = new Database().db;
const newProduct = new ProductService();

class ProductController {
  async create(req, res) {
    try {
      const validationResult = ProductValidator.validate(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const productId = await newProduct.create(req.body);
      res.status(201).json({ id: productId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export { ProductController };