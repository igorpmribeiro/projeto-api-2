class AttributeValidator {
	validate(data) {
		const errors = [];

		// Validação do groupName
		if (!data.attrGroupName) {
			errors.push('groupName é obrigatório');
		} else if (typeof data.attrGroupName !== 'string') {
			errors.push('groupName deve ser uma string');
		}

		// Validação das options
		if (!data.options || !Array.isArray(data.options)) {
			errors.push('options é obrigatório e deve ser um array');
		} else {
			data.options.forEach((option, index) => {
				if (!option.type) {
					errors.push('options: type é obrigatório');
				}

				if (!option.name) {
					errors.push('options: name é obrigatório');
				}

				if (!option.value) {
					errors.push('options: value é obrigatório');
				}

				if (typeof option.optionSort !== 'number') {
					errors.push('options: optionSort deve ser um número');
				}

				if (typeof option.valueSort !== 'number') {
					errors.push('options: valueSort deve ser um número');
				}
			});
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}

export { AttributeValidator };
