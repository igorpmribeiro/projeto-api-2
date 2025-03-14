class OrderValidator {
	constructor() {
		this.validationRule = {
			orderTotal: {
				validate: (value) => typeof value === 'number' && value >= 0,
				message: 'Order total must be a number and greater than or equal to 0',
				required: true,
			},
			customers_id: {
				validate: (value) => typeof value === 'number' && value > 0,
				message:
					'Customer ID must be a number and  is required to create an order',
				required: true,
			},
			shipping: {
				validate: (value) => {
					if (typeof value !== 'object' || value === null) return false;

					// Validate shipping method and cost
					if (typeof value.method !== 'string' || value.method.trim() === '')
						return false;
					if (typeof value.cost !== 'number' || value.cost < 0) return false;

					// Validate shipping address
					if (typeof value.address !== 'object' || value.address === null)
						return false;
					const requiredAddressFields = [
						'firstname',
						'lastname',
						'postcode',
						'street',
						'suburb',
						'city',
						'state',
					];
					for (const field of requiredAddressFields) {
						if (!value.address[field]) return false;
					}

					// Specifically check that number field exists and is a number type
					if (
						typeof value.address.number !== 'number' ||
						Number.isNaN(value.address.number)
					) {
						return false;
					}

					return true;
				},
				message:
					'Shipping must be an object with valid method, cost, and address information',
				required: true,
			},
			payment: {
				validate: (value) => {
					if (typeof value !== 'object' || value === null) return false;

					// Validate payment method
					if (typeof value.method !== 'string' || value.method.trim() === '')
						return false;

					// Validate installments
					if (typeof value.installments !== 'number' || value.installments < 1)
						return false;

					return true;
				},
				message: 'Payment must be an object with valid method and installments',
				required: true,
			},
			products: {
				validate: (value) => {
					if (!Array.isArray(value) || value.length === 0) return false;

					// Validate each product in the array
					return value.every((product) => {
						if (typeof product !== 'object' || product === null) return false;

						// Check required product fields
						if (typeof product.id !== 'number' || product.id <= 0) return false;
						if (typeof product.quantity !== 'number' || product.quantity <= 0)
							return false;
						if (typeof product.unitPrice !== 'number' || product.unitPrice < 0)
							return false;
						if (
							typeof product.finalPrice !== 'number' ||
							product.finalPrice < 0
						)
							return false;
						if (
							product.attrId !== undefined &&
							(typeof product.attrId !== 'number' || product.attrId <= 0)
						)
							return false;

						return true;
					});
				},
				message:
					'Products must be an array of valid products with id, quantity, unitPrice, and finalPrice',
				required: true,
			},
		};
	}

	validate(data) {
		const errors = [];

		for (const [field, rule] of Object.entries(this.validationRule)) {
			// Check if required field is missing
			if (
				rule.required &&
				(data[field] === undefined || data[field] === null)
			) {
				errors.push({ field, message: rule.message });
				continue;
			}

			// If field exists, validate it
			if (data[field] !== undefined && !rule.validate(data[field])) {
				errors.push({ field, message: rule.message });
			}
		}

		return errors.length > 0 ? errors : null;
	}
}

export { OrderValidator };
