class AttributeValidator {
  static validateAttribute(data) {
    const errors = []

    if (!data.name) {
      errors.push('Attribute name is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors      
    };
  }
}

export { AttributeValidator };