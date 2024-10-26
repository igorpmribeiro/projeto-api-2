class AttributeOption {
	constructor({ type, name, value, optionSort, valueSort }) {
		this.type = type;
		this.name = name;
		this.value = value;
		this.optionSort = optionSort;
		this.valueSort = valueSort;
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name,
			value: this.value,
			optionSort: this.optionSort,
			valueSort: this.valueSort,
		};
	}
}

class Attribute {
	constructor({ groupName, options = [] }) {
		this.groupName = groupName;
		this.options = options.map((option) => new AttributeOption(option));
	}

	toJSON() {
		return {
			groupName: this.groupName,
			options: this.options.map((opt) => opt.toJSON()),
		};
	}

	static fromJSON(json) {
		return new Attribute({
			groupName: json.groupname,
			options: json.options.map((option) => new AttributeOption(option)),
		});
	}
}

export { Attribute, AttributeOption };
