import Database from '../database/database.js';

class AttributeRepository {
	constructor() {
		this.db = new Database().db;
	}

	async create(attribute) {
		return new Promise((resolve, reject) => {
			const db = this.db;

			db.serialize(() => {
				db.run('BEGIN TRANSACTION');
				db.run(
					'INSERT INTO attributes (group_name) VALUES (?)',
					[attribute.groupName],
					function (err) {
						if (err) {
							console.error('Error inserting into attributes:', err);
							return reject(err);
						}
						const attrId = this.lastID;
						console.log('ID: ', attrId);

						try {
							const stmt = db.prepare(
								'INSERT INTO attribute_options ( attribute_id, type, name, value, optionSort, valueSort) VALUES (?, ?, ?, ?, ?, ?)',
							);

							for (const option of attribute.options) {
								stmt.run([
									attrId,
									option.type,
									option.name,
									option.value,
									option.optionSort,
									option.valueSort,
								]);
							}

							stmt.finalize();

							db.run('COMMIT', (err) => {
								if (err) {
									console.error('Error committing transaction:', err);
									return reject(err);
								}
								resolve();
							});
						} catch {
							db.run('ROLLBACK', (err) => {
								if (err) {
									console.error('Error rolling back transaction:', err);
									return reject(err);
								}
							});
						}
					},
				);
			});
		});
	}

	findGroups() {
		return new Promise((resolve, reject) => {
			const db = this.db;

			db.all('SELECT * FROM attributes', (err, rows) => {
				if (err) {
					console.error('Error selecting group names:', err);
					return reject(err);
				}
				resolve(rows);
			});
		});
	}

	findGroupValues(groupId) {
		return new Promise((resolve, reject) => {
			const db = this.db;

			db.all(
				'SELECT id, type, name, value, optionSort, valueSort FROM attribute_options WHERE attribute_id = ?',
				[groupId],
				(err, rows) => {
					if (err) {
						console.error('Error selecting group values:', err);
						return reject(err);
					}
					resolve(rows);
				},
			);
		});
	}
}

export { AttributeRepository };
