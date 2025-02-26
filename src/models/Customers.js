class Customers {
    constructor(data = {}) {
        this.customers_tipo_pessoa = data.type;
        this.customers_email_address = data.email;
        this.customers_firstname = data.firstname;
        this.customers_lastname = data.lastname;
        this.customers_gender = data.gender;
        this.customers_dob = data.dob;
        this.customers_cpf_cnpj = data.cpfCnpj;
        this.customers_rg = data.rg || null;
        this.customers_ddd1 = data.ddd;
        this.customers_telephone = data.phone;
        if (data.address) {
            this.address = Array.isArray(data.address) 
                ? data.address.map(addr => new CustomersAddress(addr))
                : [new CustomersAddress(data.address)];
        } else {
            this.address = [];
        }
    }
}

class CustomersAddress { 
    constructor( data = {} ) {
        this.entry_postcode = data.postcode;
        this.entry_street_address = data.street;
        this.entry_street_number = data.number;
        this.entry_street_complemento = data.complement || null;
        this.entry_suburb = data.suburb;
        this.entry_city = data.city;
        }
}

class CustomersGroup {
    constructor( data = {} ) {
        this.group_name = data.name;
        this.group_discount = data.discount;
        this.group_minorder = data.minOrder;
        this.group_maxorder = data.maxOrder;
        this.group_freeShipping = data.freeShipping;
        this.shippingBlock = data.shippingBlock;
        this.payment_rules = Array.isArray(data.paymentRules)
            ? data.paymentRules.map(rule => ({
                payment: rule.payment,
                operation: rule.operation,
                allow: rule.allow
            }))
            : [];
        }
    }

    export { Customers, CustomersAddress, CustomersGroup };