import { FabricantesService } from '../services/Fabricantes.js';

class FabricantesController {
	constructor() {
		this.IFabricanteService = new FabricantesService();
	}
	createFabricante = async (req, res, next) => {
		try {
			const fabricanteData = req.body;
			const newFabricante = await this.IFabricanteService.createFabricante(fabricanteData);
			res.status(201).json(newFabricante);
		} catch (error) {
			res.status(500).json({ message: `Internal server error: ${error.message}` });
			next(error);
		}
	};

	getFabricantes = async (req, res, next) => {
		try {
			const fabricantes = await this.IFabricanteService.getFabricantes();
			res.status(200).json(fabricantes);
		} catch (error) {
			res.status(500).json({ message: `Internal server error: ${error.message}` });
			next(error);
		}
	};

	updateFabricantes = async (req, res, next) => {
		try {
			const { id } = req.params;
			const fabricanteData = req.body;
			const result = await this.IFabricanteService.updateFabricantes(id, fabricanteData);
			res.status(200).json({
				message: 'Fabricante updated successfully',
				updatedData: result,
			});
		} catch (error) {
			res.status(500).json({ message: `Internal server error: ${error.message}` });
			next(error);
		}
	};
}

export { FabricantesController };
