import Database from '../database/database.js';
import { db } from '../config/knexfile.js';

class AttributeRepository {
async create(attribute) {
	const { options, ...attributeData } = attribute;
	const attributeToSave = {
		...attributeData,
	};

	try {
		const [id] = await db('attributes').insert(attributeToSave);
		if (options && options.length > 0) {
			const attributeOptionsToSave = options.map((option) => {
				return {
					...option,
					attribute_id: id,
				};
			});

			await db('attribute_options').insert(attributeOptionsToSave);
		}
		return {
			...attribute,
			id,
		};
	} catch (error) {
		console.error("Erro ao inserir atributo:", error);
		throw new Error("Erro ao salvar atributo no banco de dados");
	}
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
