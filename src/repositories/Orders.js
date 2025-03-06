import { db } from '../config/knexfile.js';

class OrdersRepository {
    async createOrder(order) {
    const { products, ...orderData } = order;

    try {
        const orderToInsert = {
            origin: order.origin,
            orders_status: order.orders_status, 
            date_purchased: order.date_purchased || new Date().toISOString().split('T')[0],
            order_total: order.order_total, 
            customers_id: order.customers_id, 
            
            payment_method: order.payment?.payment_method,
            payment_n_parcelas: order.payment?.payment_n_parcelas || 1,
            
            shipping_method: order.shipping?.shipping_method,
            shipping_cost: order.shipping?.shipping_cost,
            
            customers_company: order.shipping?.address?.customers_company,
            customers_firstname: order.shipping?.address?.customers_firstname,
            customers_lastname: order.shipping?.address?.customers_lastname,
            customers_postcode: order.shipping?.address?.customers_postcode,
            customers_street_address: order.shipping?.address?.customers_street_address,
            customers_street_number: order.shipping?.address?.customers_street_number,
            customers_street_complemento: order.shipping?.address?.customers_street_complemento,
            customers_suburb: order.shipping?.address?.customers_suburb,
            customers_city: order.shipping?.address?.customers_city,
            customers_state: order.shipping?.address?.customers_state
        };

        const [orderId] = await db('orders').insert(orderToInsert);

        if (products && products.length > 0) {
            // Para cada produto no array de produtos do pedido
            const productsToInsert = await Promise.all(products.map(async (product) => {
                // Buscar informações completas do produto no banco de dados
                const productDetails = await db('products').where({ id: product.id }).first();
                
                if (!productDetails) {
                    throw new Error(`Produto com ID ${product.id} não encontrado`);
                }
                
                // Se o usuário já forneceu preços específicos, use-os
                const productPrice = product.unitPrice || productDetails.price;
                const finalPrice = product.finalPrice || (productPrice * product.quantity);
                
                // Montando objeto com todos os dados do produto para a tabela orders_products
                return {
                    orders_id: orderId,
                    products_id: product.id,
                    products_quantity: product.quantity,
                    products_price: productPrice,
                    final_price: finalPrice,
                    products_name: productDetails.name,
                    products_weight: productDetails.weight || 0,
                    products_cod_ref: productDetails.codref || '',
                    products_dimensions: productDetails.dimensions ? JSON.stringify(productDetails.dimensions) : '[]',
                };
            }));

            await db('orders_products').insert(productsToInsert);
        }

        return {
            id: orderId,
            ...orderData
        };

    } catch (error) {
        console.error('Error details:', error);
        throw new Error(`Error creating order: ${error.message}`);
    }
 }
}

export { OrdersRepository };