import { AttributeRepository } from '../Attributes.js';
import { db } from '../../config/knexfile.js';

describe('AttributeRepository', () => {
	let attributeRepository;

	beforeEach(() => {
		attributeRepository = new AttributeRepository();
	});

	afterAll(async () => {
		await db.destroy(); // Fecha conexão do Knex
	});

	it('should insert a new attribute group and options', async () => {
		const attribute = {
			group_name: 'Cor',
			options: [
				{
					name: 'Vermelho',
					value: '#FF0000',
					type: 'color',
					optionSort: 1,
					valueSort: 1,
				},
				{
					name: 'Verde',
					value: '#00FF00',
					type: 'color',
					optionSort: 2,
					valueSort: 2,
				},
			],
		};

		const savedAttribute = await attributeRepository.create(attribute);

		expect(savedAttribute).toHaveProperty('id');
		expect(savedAttribute).toHaveProperty('group_name', 'Cor');
	});

	it('should get attributes groups', async () => {
		const attributes = await attributeRepository.findGroups();

		// Corrigido: usar Array.isArray ao invés de toBeInstanceOf(Array)
		expect(Array.isArray(attributes)).toBe(true);
		expect(attributes[0]).toHaveProperty('group_name');
	});

	it('should get attribute group values', async () => {
		const groupId = 1; // Substitua pelo ID do grupo que você deseja testar
		const values = await attributeRepository.findGroupValues(groupId);

		expect(Array.isArray(values)).toBe(true);
		expect(values[0]).toHaveProperty('name', 'value', 'type', 'optionSort', 'valueSort');
	});
});
