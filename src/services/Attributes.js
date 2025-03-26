import { AttributeRepository } from '../repositories/Attributes.js';
import { Attribute, AttributeOptions } from '../models/Attributes.js';

const IAttributeRepository = new AttributeRepository();

class AttributeService {
	async create(attribute) {
		const newAttribute = new Attribute(attribute);
		newAttribute.options = newAttribute.options.map((option) => new AttributeOptions(option));

		return await IAttributeRepository.create(newAttribute);
	}

	async findGroups() {
		return IAttributeRepository.findGroups();
	}

	async findGroupValues(id) {
		return IAttributeRepository.findGroupValues(id);
	}

	async findGroupName(id) {
		const groupName = await IAttributeRepository.findGroupName(id);

		return groupName;
	}
}

export { AttributeService };
