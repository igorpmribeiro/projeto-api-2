class Orders {
    constructor( data = {} ) {
        this.origin = data.origin;
        this.orders_status = data.status;
        this.date_purchased = data.datePurchased || new Date();
        this.order_total = data.orderTotal;
        this.customers_id = data.customerId;
        this.shipping = data.shipping ? new OrdersShipping( data.shipping ) : {};
        this.payment = data.payment ? new OrdersPayment( data.payment ) : {};
        this.products = data.products ? data.products.map(product => new OrdersProducts(product)) : [];
    }
}

    class OrdersShipping {
        constructor( data = {} ) {
            this.shipping_method = data.method;
            this.shipping_cost = data.cost;
            this.address = {
                customers_company: data.address?.company,
                customers_firstname: data.address?.firstname,
                customers_lastname: data.address?.lastname,
                customers_postcode: data.address?.postcode,
                customers_street_address: data.address?.street,
                customers_street_number: data.address?.number,
                customers_street_complemento: data.address?.complement,
                customers_suburb: data.address?.suburb,
                customers_city: data.address?.city,
                customers_state: data.address?.state
            };
        }
    }

    class OrdersPayment {
        constructor( data = {} ) {
            this.payment_method = data.method;
            this.payment_n_parcelas = data.installments;
        }
    }

    class OrdersProducts {
        constructor( data = {} ) {
            this.id = data.id;
            this.quantity = data.quantity || 1;
            // Campos de preço são opcionais - serão obtidos do banco de dados se não fornecidos
            this.unitPrice = data.unitPrice;  // Opcional
            this.finalPrice = data.finalPrice; // Opcional
            this.giftWrap = data.giftWrap;
            this.isFree = data.isFree;
        }
    }


export { Orders };