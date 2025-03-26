import { ScriptService } from '../services/Script.js';

class ScriptController {
	constructor() {
		this.IScriptService = new ScriptService();
	}
	async createScript(req, res) {
		try {
			const script = req.body;
			const cupom = await this.IScriptService.createScript(script);
			res.status(201).json({ message: 'Cupom criado com sucesso', cupom });
		} catch (error) {
			res.status(500).json({ error: `Internal message error ${error.message}` });
		}
	}

	async getScriptById(req, res) {
		try {
			const { id } = req.params;
			const script = await this.IScriptService.getScriptById(id);
			if (!script) {
				return res.status(404).json({ error: 'Script não encontrado' });
			}
			res.status(200).json(script);
		} catch (error) {
			res.status(500).json({ error: `Internal message error ${error.message}` });
		}
	}

	async getAllScripts(req, res) {
		try {
			const scripts = await this.IScriptService.getAllScripts();
			res.status(200).json({ scripts: scripts });
		} catch (error) {
			res.status(500).json({ error: `Internal message error ${error.message}` });
		}
	}

	async deleteScript(req, res) {
		try {
			const { id } = req.params;
			const deleted = await this.IScriptService.deleteScript(id);
			res.status(200).json({ message: deleted });
		} catch (error) {
			res.status(500).json({ error: `Internal message error ${error.message}` });
		}
	}
}

export { ScriptController };
