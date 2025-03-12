import { db } from '../config/knexfile.js';

class FabricantesRepository {
	async createFabricantes(fabricante) {
		const [id] = await db('manufacturers').insert({
			name: fabricante.name,
			image: fabricante.image,
		});
		const createdFabricante = await db('manufacturers').where({ id }).first();
		return createdFabricante;
	}

	async getFabricantes() {
		const fabricantes = await db('manufacturers');
		return fabricantes;
	}

	async updateFabricantes(id, fabricante) {
		const existingFabricante = await db('manufacturers').where({ id }).first();
		await db('manufacturers')
			.where({ id })
			.update({
				name: fabricante.name ?? existingFabricante.name,
				image: fabricante.image ?? existingFabricante.image,
			});

		return await db('manufacturers').where({ id }).first();
	}
}

export { FabricantesRepository };
