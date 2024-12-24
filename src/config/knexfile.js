import knex from 'knex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = knex({
	client: 'sqlite3',
	connection: {
		filename: path.resolve(__dirname, '..', '..', 'ecommerce.sqlite'),
	},
	useNullAsDefault: true,
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		directory: path.resolve(__dirname, '..', 'database', 'migrations'),
	},
	seeds: {
		directory: path.resolve(__dirname, '..', 'database', 'seeds'),
	},
});

export { db };
