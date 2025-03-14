class CategoryValidator {
	constructor() {
		this.validationRules = {
			name: {
				validate: (value) => typeof value === 'string',
				message: 'Name must be a string',
				required: true,
			},
			subtitle: {
				validate: (value) => typeof value === 'string',
				message: 'Subtitle must be a string',
				required: false,
			},
			discount: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message: 'Discount must be a number and greater than or equal to 0',
				required: false,
			},
			hidden: {
				validate: (value) => typeof value === 'boolean',
				message: 'Hidden must be a boolean',
				required: false,
			},
			parent_id: {
				validate: (value) => (value ? typeof value === 'number' : true),
				message: 'Parent ID must be a number or none',
				required: false,
			},
			sort_order: {
				validate: (value) => (value ? typeof value === 'number' : true),
				message: 'Sort order must be a number or none',
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
		const errors = {};

		for (const field in this.validationRules) {
			const rule = this.validationRules[field];
			const error = this.validateField(field, data[field], rule.required);
			if (error) {
				errors[field] = error;
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	}
}

export { CategoryValidator };
