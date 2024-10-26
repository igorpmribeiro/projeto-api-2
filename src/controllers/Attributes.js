import { AttributeService } from '../services/Attributes.js';
import { AttributeValidator } from '../validators/Attributes.js';

const newAttribute = new AttributeService();
const attrValidator = new AttributeValidator();

class AttributeController {
	async create(req, res) {
		try {
			const validationResult = attrValidator.validate(req.body);
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
