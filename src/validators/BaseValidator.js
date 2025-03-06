/**
 * Validador base que implementa a validação de múltiplos campos do mesmo tipo
 * Pode ser estendido para criar validadores específicos para diferentes entidades
 */
class BaseValidator {
    constructor() {
        // Define tipos de validação reutilizáveis
        this.validationRules = {
            string: {
                validate: (value) => typeof value === 'string',
                message: 'O campo deve ser uma string'
            },
            number: {
                validate: (value) => typeof value === 'number',
                message: 'O campo deve ser um número'
            },
            boolean: {
                validate: (value) => typeof value === 'boolean',
                message: 'O campo deve ser um booleano'
            },
            array: {
                validate: (value) => Array.isArray(value),
                message: 'O campo deve ser um array'
            },
            email: {
                validate: (value) => /\S+@\S+\.\S+/.test(value),
                message: 'Email inválido'
            },
            date: {
                validate: (value) => /\d{4}-\d{2}-\d{2}/.test(value),
                message: 'Data inválida (YYYY-MM-DD)'
            },
            decimal: {
                validate: (value) => typeof value === 'number' && !Number.isNaN(value),
                message: 'O campo deve ser um número válido'
            },
            minLength: (min) => ({
                validate: (value) => value && value.length >= min,
                message: `O campo deve ter pelo menos ${min} caracteres`
            }),
            maxLength: (max) => ({
                validate: (value) => value && value.length <= max,
                message: `O campo deve ter no máximo ${max} caracteres`
            }),
            minValue: (min) => ({
                validate: (value) => value >= min,
                message: `O valor deve ser pelo menos ${min}`
            }),
            maxValue: (max) => ({
                validate: (value) => value <= max,
                message: `O valor não pode ser maior que ${max}`
            }),
            range: (min, max) => ({
                validate: (value) => value >= min && value <= max,
                message: `O valor deve estar entre ${min} e ${max}`
            })
        };
    }

    // Validar campos do mesmo tipo de uma vez
    validateByType(type, fields, object) {
        const errors = [];
        const rule = this.validationRules[type];
        
        if (!rule) {
            return [`Tipo de validação '${type}' não definido`];
        }
        
        for (const field of fields) {
            if (object[field] !== undefined && !rule.validate(object[field])) {
                errors.push(`${field}: ${rule.message}`);
            }
        }
        
        return errors;
    }

    // Validar campos obrigatórios
    validateRequired(fields, object) {
        const errors = [];
        
        for (const field of fields) {
            if (object[field] === undefined || object[field] === null || object[field] === '') {
                errors.push(`${field} é obrigatório`);
            }
        }
        
        return errors;
    }

    // Validar um objeto com base em um conjunto de regras
    validateObject(object, fieldRules) {
        if (!object) {
            return ['Objeto inválido'];
        }
        
        const errors = [];
        
        for (const [field, rules] of Object.entries(fieldRules)) {
            if (object[field] !== undefined) {
                for (const rule of rules) {
                    let ruleValidator;
                    
                    if (typeof rule === 'object') {
                        // Regras complexas (com parâmetros)
                        switch (rule.type) {
                            case 'minLength':
                                ruleValidator = this.validationRules.minLength(rule.param);
                                break;
                            case 'maxLength':
                                ruleValidator = this.validationRules.maxLength(rule.param);
                                break;
                            case 'minValue':
                                ruleValidator = this.validationRules.minValue(rule.param);
                                break;
                            case 'maxValue':
                                ruleValidator = this.validationRules.maxValue(rule.param);
                                break;
                            case 'range':
                                ruleValidator = this.validationRules.range(rule.params[0], rule.params[1]);
                                break;
                            default:
                                ruleValidator = this.validationRules[rule.type];
                        }
                    } else {
                        // Regras simples (string direta)
                        ruleValidator = this.validationRules[rule];
                    }
                    
                    if (!ruleValidator || !ruleValidator.validate(object[field])) {
                        const message = ruleValidator ? ruleValidator.message : `Regra de validação inválida para ${field}`;
                        errors.push(`${field}: ${message}`);
                    }
                }
            }
        }
        
        return errors;
    }
}

export { BaseValidator };