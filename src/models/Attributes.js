class Attribute {
	constructor(data = {}) {
		this.group_name = data.attrGroupName,
		this.options = data.options ? data.options.map(option => new AttributeOptions(option)) : []
	}
}

class AttributeOptions{
	constructor( data = {}) {
		this.type = data.type,
		this.name = data.name,
		this.value = data.value,
		this.optionSort = data.optionSort,
		this.valueSort = data.valueSort
	}
}

export { Attribute, AttributeOptions };