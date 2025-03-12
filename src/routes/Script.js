import { Router } from 'express';
import { ScriptController } from '../controllers/Script.js';

const scriptRouter = new Router();
const scriptController = new ScriptController();

scriptRouter.post('/insert', scriptController.createScript);
scriptRouter.delete('/delete/:id', scriptController.deleteScript);
scriptRouter.get('/:id', scriptController.getScriptById);
scriptRouter.get('/', scriptController.getAllScripts);

export { scriptRouter };