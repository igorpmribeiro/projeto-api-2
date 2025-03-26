import { AttributeService } from '../services/Attributes.js';
import { AttributeValidator } from '../validators/Attributes.js';

const IAttributeService = new AttributeService();
const attrValidator = new AttributeValidator();

class AttributeController {
	async create(req, res, next) {
		try {
			const validationResult = attrValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ errors: validationResult.errors });
			}

			const attributeId = await IAttributeService.create(req.body);
			res.status(201).json({
				result: attributeId,
				message: 'Attribute created successfully',
			});
		} catch (error) {
			next(error);
			res.status(500).json({ error: error.message });
		}
	}

	async getGroups(req, res) {
		try {
			const groups = await IAttributeService.findGroups();
			const groupsWithOptions = await Promise.all(
				groups.map(async (group) => {
					const optionsCount = await IAttributeService.findGroupValues(group.id);
					return {
						id: group.id,
						group_name: group.group_name,
						options: optionsCount.length,
					};
				}),
			);
			res.status(200).json({ status: 200, count: groupsWithOptions.length, groups: groupsWithOptions });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async findGroupValues(req, res) {
		try {
			const groupId = req.params.id;
			const groupName = await IAttributeService.findGroupName(groupId);
			const groupValues = await IAttributeService.findGroupValues(groupId);

			if (!groupValues) {
				return res.status(404).json({ error: 'Group not found' });
			}

			res.status(200).json({ Count: groupValues.length, groupName: groupName, groupValues });
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}
}

export { AttributeController };
