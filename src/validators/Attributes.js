class AttributeValidator {
	constructor() {
		this.validationRules = {
			attrGroupName: {
				validate: (value) => typeof value === 'string',
				message: 'Attribute group is required and must be a string',
				required: true,
			},
			options: {
				validate: (value) =>
					Array.isArray(value) &&
					value.every(
						(option) => typeof option === 'object' && option !== null,
					),
				message: 'Options must be an array of valid options',
				required: true,
			},
		};

		// Define specific validation rules for option fields
		this.optionFieldRules = {
			name: {
				validate: (value) => typeof value === 'string' && value.trim() !== '',
				message: 'Option name is required and must be a non-empty string',
				required: true,
			},
			value: {
				validate: (value) => typeof value === 'string',
				message: 'Option value is required and must be a string',
				required: true,
			},
			type: {
				validate: (value) =>
					typeof value === 'string' &&
					['swatch', 'color', 'radio'].includes(value),
				message: 'Option type must be one of: swatch, color or radio',
				required: true,
			},
			optionSort: {
				validate: (value) => typeof value === 'number' || value === undefined,
				message: 'Option sort must be a number',
				required: true,
			},
			valueSort: {
				validate: (value) => typeof value === 'number' || value === undefined,
				message: 'Value sort must be a number',
				required: true,
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

	// New method to validate individual option fields
	validateOptionField(fieldName, value, isRequired = false) {
		const rule = this.optionFieldRules[fieldName];

		if (!rule) return null;

		if (value === undefined) {
			return isRequired ? rule.message : null;
		}

		if (value !== undefined && !rule.validate(value)) {
			return rule.message;
		}

		return null;
	}

	// Validate each option in the options array
	validateOptionFields(options) {
		const errors = [];

		if (!Array.isArray(options)) {
			errors.push('Options must be an array');
			return errors;
		}

		for (const option of options) {
			for (const fieldName of Object.keys(this.optionFieldRules)) {
				const rule = this.optionFieldRules[fieldName];
				const error = this.validateOptionField(
					fieldName,
					option[fieldName],
					rule.required,
				);
				if (error) {
					errors.push(` ${error}`);
				}
			}
		}

		return errors;
	}

	validate(data) {
		const errors = [];

		for (const field of Object.keys(this.validationRules)) {
			const rule = this.validationRules[field];
			const error = this.validateField(field, data[field], rule.required);
			if (error) errors.push(error);

			// Add specific option field validations
			if (field === 'options' && Array.isArray(data[field])) {
				const optionErrors = this.validateOptionFields(data[field]);
				errors.push(...optionErrors);
			}
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

				// Add specific option field validations for updates
				if (field === 'options' && Array.isArray(data[field])) {
					const optionErrors = this.validateOptionFields(data[field]);
					errors.push(...optionErrors);
				}
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	validateOptions(data) {
		const errors = [];

		for (const field of Object.keys(this.validationRules)) {
			if (this.validationRules[field]) {
				const error = this.validateField(field, data[field], false);
				if (error) errors.push(error);
			}
		}

		// If options exist, validate each option field
		if (data.options && Array.isArray(data.options)) {
			const optionErrors = this.validateOptionFields(data.options);
			errors.push(...optionErrors);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}

export { AttributeValidator };
