import { ScriptRepository } from '../repositories/Script.js';
import { Script } from '../models/Script.js';

class ScriptService {
	constructor() {
		this.IScriptRepository = new ScriptRepository();
	}

	async createScript(script) {
		const newScript = new Script(script);
		const id = await this.IScriptRepository.createScript(newScript);
		return id;
	}

	async getScriptById(id) {
		if (!id) {
			throw new Error('Invalid ID provided');
		}

		const script = await this.IScriptRepository.getScriptById(id);
		if (!script) {
			throw new Error('Script not found');
		}

		return script;
	}

	async getAllScripts() {
		const scripts = await this.IScriptRepository.getAllScripts();
		return scripts;
	}

	async deleteScript(id) {
		if (!id) {
			throw new Error('Invalid ID provided');
		}

		const scriptExists = await this.IScriptRepository.getScriptById(id);
		if (!scriptExists) {
			throw new Error('Script not found');
		}

		const deleted = await this.IScriptRepository.deleteScript(id);
		return deleted;
	}
}

export { ScriptService };
