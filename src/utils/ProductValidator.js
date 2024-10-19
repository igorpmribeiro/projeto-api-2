class ProductValidator {
  static validate(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string') {
      errors.push('Nome é obrigatório e deve ser uma string');
    }

    if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Preço é obrigatório e deve ser um número positivo');
    }

    if (!Number.isInteger(data.quantity) || data.quantity < 0) {
      errors.push('Quantidade é obrigatória e deve ser um número inteiro não negativo');
    }

    if (data.description && typeof data.description !== 'string') {
      errors.push('Descrição deve ser uma string');
    }

    if (data.categories && !Array.isArray(data.categories)) {
      errors.push('Categorias devem ser um array');
    }

    if (data.codref && typeof data.codref !== 'string') {
      errors.push('Código de referência é obrigatório e deve ser uma string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { ProductValidator };