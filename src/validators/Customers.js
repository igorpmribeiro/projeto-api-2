const CustomerValidator = (customer) => {
    const errors = [];

    if (!customer.name || customer.name.length < 3) {
        errors.push('Customer name is required and must be at least 3 characters');
    }

    if (!customer.email || !/\S+@\S+\.\S+/.test(customer.email)) {
        errors.push('A Valid email is required');
    }

    if (!customer.dob || !/\d{4}-\d{2}-\d{2}/.test(customer.dob)) {
        errors.push('A Valid date of birth is required (YYYY-MM-DD)');
    }
    if (!customer.cpfCnpj || !(/^\d{11}$|^\d{14}$/.test(customer.cpfCnpj))) {
        errors.push('A Valid CPF (11 digits) or CNPJ (14 digits) is required');
    }

    return errors;
}

export { CustomerValidator };