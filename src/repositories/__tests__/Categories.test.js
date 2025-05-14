import { CategoryRepository } from '../Categories.js';
import { db } from '../../config/knexfile.js';

describe('CategoryRepository', () => {
	let categoryRepository;

	beforeEach(() => {
		categoryRepository = new CategoryRepository();
	});

	afterAll(async () => {
		await db.destroy(); // Fecha conex�o do Knex
	});

	it('should insert a new category', async () => {
		await db('categories').del(); // Limpa a tabela antes do teste
		const category = {
			name: 'Categoria para Teste',
			subtitle: 'Subt�tulo para Teste',
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
			subtitle: 'Subt�tulo para Atualizar',
			hidden: false,
			discount: 0,
		};

		const id = await categoryRepository.create(category);
		const updatedCategory = await categoryRepository.update(id, {
			name: 'Categoria Atualizada',
			subtitle: 'Subt�tulo Atualizado',
		});

		expect(updatedCategory).toHaveProperty('name', 'Categoria Atualizada');
	});

	it('should return category data', async () => {
		const category = {
			name: 'Categoria para Buscar',
			subtitle: 'Subt�tulo para Buscar',
			hidden: false,
			discount: 0,
		};

		const id = await categoryRepository.create(category);
		const foundCategory = await categoryRepository.findById(id);

		expect(foundCategory).toHaveProperty('id', id);
		expect(foundCategory).toHaveProperty('name', 'Categoria para Buscar');
	});
});
