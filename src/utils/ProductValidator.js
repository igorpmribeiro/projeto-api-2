class ProductValidator {
  static validate(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Price must be a number greater than 0');
    }

    if (typeof data.quantity !== 'number' || data.quantity < 0) {
      errors.push('Quantity must be a number');
    }

    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string');
    }

    if (data.categories && !Array.isArray(data.categories)) {
      errors.push('Categories must be an array');
    }

    if (data.codref && typeof data.codref !== 'string') {
      errors.push('SKU must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { ProductValidator };