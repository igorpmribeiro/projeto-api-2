class AttributeValidator {
	validate(data) {
		const errors = [];
		if (!data) {
			errors.push('Name is required');
		}
		return {
			isValid: !errors.length,
			errors,
		};
	}
}

export { AttributeValidator };
