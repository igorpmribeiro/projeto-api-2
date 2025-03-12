import { Fabricantes } from '../models/Fabricantes.js';
import { FabricantesRepository } from '../repositories/Fabricantes.js';

class FabricantesService {
	constructor() {
		this.fabricantesRepository = new FabricantesRepository();
	}

	async createFabricante(fabricanteData) {
		const fabricante = new Fabricantes(fabricanteData);
		return await this.fabricantesRepository.createFabricantes(fabricante);
	}

	async getFabricantes() {
		const fabricantes = await this.fabricantesRepository.getFabricantes();

		if (!fabricantes) {
			throw new Error('No manufacturers found');
		}
		return fabricantes;
	}

	async updateFabricantes(id, fabricanteData) {
		const fabricante = new Fabricantes(fabricanteData);
		const updatedFabricante =
			await this.fabricantesRepository.updateFabricantes(id, fabricante);

		return updatedFabricante;
	}
}

export { FabricantesService };
