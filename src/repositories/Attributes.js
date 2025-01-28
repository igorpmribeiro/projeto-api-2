import Database from '../database/database.js';
import { db } from '../config/knexfile.js';

class AttributeRepository {
	async create(attribute) {
		return await db.transaction(async (trx) => {
			const [attributeId] = await trx('attributes').insert({
				group_name: attribute.groupName,
			});

			const options = attribute.options.map((option) => ({
				attribute_id: attributeId,
				type: option.type,
				name: option.name,
				value: option.value,
				optionSort: option.optionSort,
				valueSort: option.valueSort,
			}));

			await trx('attribute_options').insert(options);

			return attributeId;
		});
	}

	findGroups() {
		return db('attributes').select('id', 'group_name');
	}

	findGroupValues(groupId) {
		return db('attribute_options')
			.where('attribute_id', groupId)
			.select('id', 'type', 'name', 'value', 'optionSort', 'valueSort');
	}
}

export { AttributeRepository };
