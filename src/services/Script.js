import { ScriptRepository } from "../repositories/Script.js";
import { Script } from "../models/Script.js";

class ScriptService {
    constructor() {
        this.scriptRepository = new ScriptRepository();
    }

    async createScript(script) {
        const newScript = new Script(script);
        const id = await this.scriptRepository.createScript(newScript);
        return id;
    }

    async getScriptById(id) {
        if (!id) {
            throw new Error('Invalid ID provided');
        }

        const script = await this.scriptRepository.getScriptById(id);
        if (!script) {
            throw new Error('Script not found');
        }

        return script;
    }

    async getAllScripts() {
        const scripts = await this.scriptRepository.getAllScripts();
        return scripts;
    }

    async deleteScript(id) {

        if (!id) {
            throw new Error('Invalid ID provided');
        }


        const scriptExists = await this.scriptRepository.getScriptById(id);
        if (!scriptExists) {
            throw new Error('Script not found');
        }

        const deleted = await this.scriptRepository.deleteScript(id);
        return deleted;
    }
}

export { ScriptService };