import { AttributeValidator } from "../utils/AttributeValidator.js";
import { AttributeService } from "../services/AttributeService.js";

const newAttribute = new AttributeService();

class AttributeController {
  async create(req, res) {
    try {
      const validationResult = AttributeValidator.validate(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const attributeId = await newAttribute.create(req.body);
      res.status(201).json({ id: attributeId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export { AttributeController };