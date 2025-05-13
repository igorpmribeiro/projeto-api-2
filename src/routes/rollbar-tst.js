// src/routes/test.js
import express from 'express';
const errorRouter = express.Router();

errorRouter.get('/error', (req, res, next) => {
	next(new Error('Erro intencional para testar o Rollbar'));
});

export default errorRouter;
