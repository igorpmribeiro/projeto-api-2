class PromotionValidator {
	constructor() {
		this.validationRules = {
			status: {
				validate: (value) => typeof value === 'number' && (value === 0 || value === 1),
				message: 'Status must be a number (0 or 1)',
				required: true,
			},
			product_id: {
				validate: (value) => typeof value === 'number',
				message: 'Product ID is required and must be a number',
				required: true,
			},
			schedule_date: {
				validate: (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value),
				message: 'Schedule date must be a valid date string in format yyyy-mm-dd',
				required: false,
			},
			expires_date: {
				validate: (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value),
				message: 'Expires date must be a valid date string in format yyyy-mm-dd',
				required: false,
			},
			groups: {
				validate: (value) => Array.isArray(value) && value.every((group) => typeof group === 'number'),
				message: 'Groups must be an array of numbers',
				required: false,
			},
			special_price: {
				validate: (value) => typeof value === 'number' && value > 0,
				message: 'Special price must be a positive number',
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
			if (error) {
				console.log(`Validation error for field "${field}": ${error}`); // Debugging log
				errors.push(error);
			}
		}

		return {
			errors,
		};
	}
}

export { PromotionValidator };
