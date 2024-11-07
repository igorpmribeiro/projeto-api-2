class CategoryValidator {
	validate(data) {
		const errors = [];

		if (!data.name) {
			errors.push('Category name is required');
		}

		if (typeof data.discount !== 'number') {
			errors.push('Category discount must be a number');
		}

		if (typeof data.hidden !== 'boolean') {
			errors.push('Category hidden must be a boolean (true or false)');
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}

export { CategoryValidator };
