import { AttributeRepository } from '../repositories/Attributes.js';
import { Attribute, AttributeOption } from '../models/Attributes.js';

class AttributeService {
	constructor() {
		this.attributeRepository = new AttributeRepository();
	}

	async create(attribute) {
		if (!attribute || !attribute.groupName || !attribute.options) {
			throw new Error('Invalid attribute data');
		}

		// Corrigindo a criação do Attribute
		const newAttribute = new Attribute({
			groupName: attribute.groupName,
			options: attribute.options.map((option) => ({
				type: option.type,
				name: option.name,
				value: option.value,
				optionSort: option.optionSort,
				valueSort: option.valueSort,
			})),
		});

		return this.attributeRepository.create(newAttribute);
	}

	async findGroups() {
		return this.attributeRepository.findGroups();
	}

	async findGroupValues(id) {
		return this.attributeRepository.findGroupValues(id);
	}
}

export { AttributeService };
