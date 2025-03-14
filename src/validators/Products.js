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
				message: 'Price must be a number and greater than or equal to 0',
				required: true,
			},
			quantity: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message: 'Quantity must be a number and greater than or equal to 0',
				required: true,
			},
			description_full: {
				validate: (value) => typeof value === 'string',
				message: 'Description must be a string',
				required: false,
			},
			small_description: {
				validate: (value) =>
					typeof value === 'string' || (value && value.length <= 255),
				message:
					'Small description must be a string and less than 255 characters',
				required: false,
			},
			weight: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message: 'Weight must be a number and greater than or equal to 0',
				required: false,
			},
			check_stock: {
				validate: (value) =>
					typeof value === 'string' &&
					(value === 'products' || value === 'attributes'),
				message: 'Check stock must be either "products" or "attributes"',
				required: true,
			},
			quantity_critical: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message:
					'Critical quantity must be a number and greater than or equal to 0',
				required: false,
			},
			categories: {
				validate: (value) =>
					Array.isArray(value) && value.every((cat) => typeof cat === 'number'),
				message: 'Categories must be an array with numbers',
				required: false,
			},
			codref: {
				validate: (value) => typeof value === 'string',
				message: 'Codref must be a string',
				required: false,
			},
			attrGroupId: {
				validate: (value) => (value ? typeof value === 'number' : true),
				message: 'attrGroupId must be a number',
				required: false,
			},
			attributes: {
				validate: (value) =>
					Array.isArray(value) &&
					value.every((attr) => typeof attr === 'object' && attr !== null),
				message: 'Attributes must be an array of objects',
				required: false,
			},
			images: {
				validate: (value) =>
					Array.isArray(value) &&
					value.every(
						(img) =>
							typeof img === 'string' ||
							(typeof img === 'object' && img !== null),
					),
				message: 'Images must be an array of strings or objects',
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
