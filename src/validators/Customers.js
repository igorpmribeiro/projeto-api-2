class CustomersValidator {
	constructor() {
		this.validationRules = {
			type: {
				validate: (value) =>
					typeof value === 'string' && (value === 'F' || value === 'J'),
				message:
					'Type must be a string and can only be F (Fisica) or J (Juridica)',
				required: true,
			},
			email: {
				validate: (value) => typeof value === 'string' && value.includes('@'),
				message: 'Email must be a valid email address',
				required: true,
			},
			firstname: {
				validate: (value) => typeof value === 'string',
				message: 'Firstname must be a string',
				required: true,
			},
			lastname: {
				validate: (value) => typeof value === 'string',
				message: 'Lastname must be a string',
				required: true,
			},
			gender: {
				validate: (value) =>
					typeof value === 'string' && (value === 'M' || value === 'F'),
				message:
					'Gender must be a string and can only be M (Masculino) or F (Feminino)',
				required: false,
			},
			dob: {
				validate: (value) =>
					typeof value === 'string' &&
					/^\d{4}-\d{2}-\d{2}$/.test(value) &&
					!Number.isNaN(Date.parse(value)),
				message: 'Date of birth must be a string in the format YYYY-MM-DD',
				required: false,
			},
			cpfCnpj: {
				validate: (value) => {
					if (typeof value !== 'string') return false;

					if (/^\d+$/.test(value)) {
						return value.length === 11 || value.length === 14;
					}

					return (
						/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) ||
						/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value)
					);
				},
				message:
					'CPF must be in format xxx.xxx.xxx-xx or CNPJ must be in format xx.xxx.xxx/xxxx-xx',
				required: true,
			},
			ddd: {
				validate: (value) => typeof value === 'string' && /^\d{2}$/.test(value),
				message: 'DDD must be a string in the format xx',
				required: true,
			},
			phone: {
				validate: (value) => typeof value === 'string' && /^\d{9}$/.test(value),
				message: 'Phone must be a string in the format xxxxxxxxx',
				required: true,
			},
			address: {
				validate: (value) => {
					// Aceitar tanto array de objetos quanto um objeto único
					return (
						(Array.isArray(value) && value.length > 0) ||
						(typeof value === 'object' &&
							value !== null &&
							!Array.isArray(value))
					);
				},
				message: 'Address must be an object or an array of objects',
				required: true,
			},
		};

		this.addressValidationRules = {
			postcode: {
				validate: (value) => typeof value === 'string' && value.length === 8,
				message: 'Postcode must be a string of length 8',
				required: true,
			},
			street: {
				validate: (value) => typeof value === 'string',
				message: 'Street must be a string',
				required: true,
			},
			number: {
				validate: (value) => typeof value === 'string',
				message: 'Number must be a string',
				required: true,
			},
			complement: {
				validate: (value) => typeof value === 'string' && value.length <= 30,
				message: 'Complement must be a string. Max length is 30',
				required: false,
			},
			suburb: {
				validate: (value) => typeof value === 'string',
				message: 'Suburb must be a string',
				required: true,
			},
			city: {
				validate: (value) => typeof value === 'string',
				message: 'City must be a string',
				required: true,
			},
			state: {
				validate: (value) => typeof value === 'string' && value.length === 2,
				message: 'State must be a string of length 2',
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
	validateAddressField(fieldName, value, isRequired = false) {
		const rule = this.addressValidationRules[fieldName];

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

		// Adicionar validação específica para os campos do endereço
		if (data.address && this.validationRules.address.validate(data.address)) {
			const addressData = Array.isArray(data.address)
				? data.address[0]
				: data.address;
			const addressValidation = this.validateAddress(addressData);

			if (!addressValidation.isValid) {
				errors.addressDetails = addressValidation.errors;
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	}
	validateAddress(data) {
		const errors = {};

		for (const field in this.addressValidationRules) {
			const rule = this.addressValidationRules[field];
			const error = this.validateAddressField(
				field,
				data[field],
				rule.required,
			);
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

export { CustomersValidator };
