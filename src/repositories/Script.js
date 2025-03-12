import { db } from '../config/knexfile.js';

class ScriptRepository {
    async createScript(script) {
        // Insere o script e obtém o ID
        const [id] = await db('scripts').insert({
            script_name: script.name,
            script_description: script.description,
            script_url: script.url,
            script_local: script.local,
        });
        
        // Consulta o banco para obter o script completo
        const createdScript = await db('scripts').where({ id }).first();
        return createdScript;
    }

    async getScriptById(id) {
        const script = await db('scripts').where({ id }).first();
        return script;
    }

    async getAllScripts() {
        const scripts = await db('scripts').select('*');
        return scripts;
    }

    async deleteScript(id) {
        const deleted = await db('scripts').where({ id }).del();
        
        if (deleted) {
            return { message: 'Script deletado com sucesso' };
        }
            throw new Error('Script não encontrado');
        
    }
}

export { ScriptRepository };