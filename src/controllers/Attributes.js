import { AttributeService } from '../services/Attributes.js';
import { AttributeValidator } from '../validators/Attributes.js';

const IAttributeService = new AttributeService();
const attrValidator = new AttributeValidator();

class AttributeController {
	async create(req, res) {
		try {
			const validationResult = attrValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			const attributeId = await IAttributeService.create(req.body);
			res.status(201).json({
				message: 'Attribute created successfully',
				id: attributeId,
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async getGroups(req, res) {
		try {
			const groups = await IAttributeService.findGroups();
			res.status(200).json(groups);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async findGroupValues(req, res) {
		try {
			const groupId = req.params.id;
			const groupValues = await IAttributeService.findGroupValues(groupId);

			if (!groupValues) {
				return res.status(404).json({ error: 'Group not found' });
			}

			res.status(200).json({ Count: groupValues.length, groupValues });
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}
}

export { AttributeController };
