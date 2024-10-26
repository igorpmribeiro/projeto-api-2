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

		const newAttribute = new Attribute(
			null,
			attribute.groupName,
			attribute.options.map((option) => new AttributeOption(null, option)),
		);
		return this.attributeRepository.create(newAttribute);
	}
}

export { AttributeService };
