import { AttributeRepository } from '../repositories/Attributes.js';
import { Attribute, AttributeOptions } from '../models/Attributes.js';

class AttributeService {
	constructor() {
		this.IAttributeRepository = new AttributeRepository();
	}
	async create(attribute) {
		const newAttribute = new Attribute(attribute);
		newAttribute.options = newAttribute.options.map((option) => new AttributeOptions(option));

		return await this.IAttributeRepository.create(newAttribute);
	}

	async findGroups() {
		return this.IAttributeRepository.findGroups();
	}

	async findGroupValues(id) {
		return this.IAttributeRepository.findGroupValues(id);
	}

	async findGroupName(id) {
		const groupName = await this.IAttributeRepository.findGroupName(id);

		return groupName;
	}
}

export { AttributeService };
