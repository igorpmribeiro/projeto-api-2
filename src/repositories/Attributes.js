import Database from '../database/database.js';

class AttributeRepository {
	constructor() {
		this.db = new Database().db;
	}

	async create(attribute) {
		const { groupName, options } = attribute;

		try {
			await this.db.run('BEGIN TRANSACTION');

			const { lastID } = await this.db.run(
				'INSERT INTO attributes (group_name) VALUES (?)',
				[groupName],
			);

			for (const option of options) {
				await this.db.run(
					'INSERT INTO attribute_options (attribute_id, option_name) VALUES (?, ?)',
					[lastID, option],
				);
			}

			await this.db.run('COMMIT');
			return lastID;
		} catch {
			await this.db.run('ROLLBACK');
			throw { message: 'Error creating attribute' };
		}
	}
}

export { AttributeRepository };
