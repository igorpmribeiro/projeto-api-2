import { CategoryRepository } from '../Categories.js';
import { db } from '../../config/knexfile.js';

describe('CategoryRepository', () => {
	let categoryRepository;

	beforeEach(() => {
		categoryRepository = new CategoryRepository();
	});

	afterAll(async () => {
		await db.destroy(); // Fecha conexão do Knex
	});

	it('should insert a new category', async () => {
		const category = {
			name: 'Categoria para Teste',
			subtitle: 'Subtítulo para Teste',
			hidden: false,
			discount: 0,
		};

		const id = await categoryRepository.create(category);
		const savedCategory = await categoryRepository.findById(id);

		expect(savedCategory).toHaveProperty('id');
		expect(savedCategory).toHaveProperty('name', 'Categoria para Teste');
	});

	it('should update a category', async () => {
		const category = {
			name: 'Categoria para Atualizar',
			subtitle: 'Subtítulo para Atualizar',
			hidden: false,
			discount: 0,
		};

		const id = await categoryRepository.create(category);
		const updatedCategory = await categoryRepository.update(id, {
			name: 'Categoria Atualizada',
			subtitle: 'Subtítulo Atualizado',
		});

		expect(updatedCategory).toHaveProperty('name', 'Categoria Atualizada');
	});

	it('should return category data', async () => {
		const getCategory = await categoryRepository.findById(32);
		expect(getCategory).toHaveProperty('id', 32);
		expect(getCategory).toHaveProperty('name', 'Produtos para Casa');
	});
});
