import { AttributeRepository } from '../repositories/Attributes.js';
import { Attribute, AttributeOptions } from '../models/Attributes.js';

class AttributeService {
	constructor() {
		this.attributeRepository = new AttributeRepository();
	}

	async create(attribute) {
		const newAttribute = new Attribute(attribute);
		newAttribute.options = newAttribute.options.map(
			(option) => new AttributeOptions(option)
		);

		return await this.attributeRepository.create(newAttribute);
	}

	async findGroups() {
		return this.attributeRepository.findGroups();
	}

	async findGroupValues(id) {
		return this.attributeRepository.findGroupValues(id);
	}
}

export { AttributeService };
