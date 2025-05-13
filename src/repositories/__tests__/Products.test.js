import { ProductRepository } from '../Products.js';
import { db } from '../../config/knexfile.js';

describe('ProductRepository', () => {
	let repository;

	beforeAll(() => {
		repository = new ProductRepository();
	});

	afterAll(async () => {
		await db.destroy(); // Fecha conexão do Knex
	});

	it('deve retornar vazio se não houver produtos', async () => {
		// Garante que a tabela está vazia
		await db('products').del();
		const products = await repository.listAllProducts();
		expect(products).toEqual([]);
	});

	it('deve criar e buscar um produto', async () => {
		const produto = {
			name: 'Produto Teste',
			price: 10.5,
			quantity: 5,
			description_full: 'Descrição teste',
			codref: 'COD123',
			images: ['https://example.com/image1.jpg'],
			dimensions: [],
			categories: [],
			attributes: [],
		};
		const created = await repository.create(produto);
		expect(created).toHaveProperty('id');
		const found = await repository.findById(created.id);
		expect(found.name).toBe('Produto Teste');
		expect(found.price).toBe(10.5);
	});

	it('deve atualizar um produto', async () => {
		const produto = {
			name: 'Produto Atualizar',
			price: 20,
			quantity: 2,
			description_full: 'Desc',
			codref: 'COD456',
			images: [],
			dimensions: [],
			categories: [],
			attributes: [],
		};
		const created = await repository.create(produto);
		const updated = await repository.updateProduct(created.id, { name: 'Novo Nome' });
		expect(updated.name).toBe('Novo Nome');
	});

	it('deve retornar estoque e preço corretamente', async () => {
		const produto = {
			name: 'Produto Estoque',
			price: 99,
			quantity: 7,
			description_full: 'Desc',
			codref: 'COD789',
			images: [],
			dimensions: [],
			categories: [],
			attributes: [],
		};
		const created = await repository.create(produto);
		const estoque = await repository.checkProductStock(created.id);
		const preco = await repository.checkProductPrice(created.id);
		expect(estoque).toBe(7);
		expect(preco).toBe(99);
	});
});
