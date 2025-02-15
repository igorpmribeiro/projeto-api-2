class CategoryValidator {
	validate(data) {
		const errors = [];

		if (!data.name) {
			errors.push('Category name is required');
		}

		// if (typeof data.discount !== 'number') {
		// 	errors.push('Category discount must be a number');
		// }

		// if (typeof data.hidden !== 'boolean') {
		// 	errors.push('Category hidden must be a boolean (true or false)');
		// }

		if (data.parent_id !== undefined && typeof data.parent_id !== 'number') {
			errors.push('Category parent_id must be a number');
		}

		if (data.sort_order !== undefined && typeof data.sort_order !== 'number') {
			errors.push('Category sort_order must be a number');
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}

export { CategoryValidator };
