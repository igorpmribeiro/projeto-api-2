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
						attribute_id: id,
						...option,
					};
				});

				await db('attribute_options').insert(attributeOptionsToSave);
			}
			return {
				id,
				...attribute,
			};
		} catch (error) {
			console.error('Erro ao inserir atributo:', error);
			throw new Error('Erro ao salvar atributo no banco de dados');
		}
	}

	async findGroups() {
		return db('attributes').select('id', 'group_name');
	}

	findGroupValues(groupId) {
		return db('attribute_options').where('attribute_id', groupId).select('id', 'type', 'name', 'value', 'optionSort', 'valueSort');
	}

	async findGroupName(groupId) {
		const group = await db('attributes').where('id', groupId).select('group_name').first();
		if (!group) {
			throw new Error('Grupo não encontrado');
		}
		return group.group_name;
	}
}

export { AttributeRepository };
