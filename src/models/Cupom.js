class Cupons {
    constructor(data = {}) {
        this.code = data.code;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.value = data.value;
        this.max_discount = data.max_discount;
        this.max_customer_use = data.max_customer_use;
        this.products = data.products || [];
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.regras = data.rules ? new CuponsRules(data.rules) : null;
    }
}

class CuponsRules {
    constructor(rules = {}) {
        this.customers = Array.isArray(rules.customer) ? rules.customer : [];
        this.categories = Array.isArray(rules.categories) ? rules.categories : [];
        this.products = Array.isArray(rules.products) ? rules.products : [];
    }
}

export { Cupons, CuponsRules };