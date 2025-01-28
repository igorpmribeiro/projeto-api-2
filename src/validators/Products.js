class ProductValidator {
	constructor() {
		this.validationRules = {
			name: {
				validate: (value) => typeof value === 'string',
				message: 'Name must be a string',
				required: true,
			},
			price: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message: 'Price must be a number greater or equal to 0',
				required: true,
			},
			quantity: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message: 'Quantity must be a number',
				required: true,
			},
			description: {
				validate: (value) => typeof value === 'string',
				message: 'Description must be a string',
				required: false,
			},
			categories: {
				validate: (value) => Array.isArray(value),
				message: 'Categories must be an array',
				required: false,
			},
			codref: {
				validate: (value) => typeof value === 'string',
				message: 'Codref must be a string',
				required: false,
			},
		};
	}

	validateField(fieldName, value, isRequired = false) {
		const rule = this.validationRules[fieldName];

		if (value === undefined) {
			return isRequired ? rule.message : null;
		}

		if (value !== undefined && !rule.validate(value)) {
			return rule.message;
		}

		return null;
	}

	validate(data) {
		const errors = [];

		for (const field of Object.keys(this.validationRules)) {
			const rule = this.validationRules[field];
			const error = this.validateField(field, data[field], rule.required);
			if (error) errors.push(error);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	validateUpdate(data) {
		const errors = [];

		for (const field of Object.keys(data)) {
			if (this.validationRules[field]) {
				const error = this.validateField(field, data[field], false);
				if (error) errors.push(error);
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}

export { ProductValidator };
