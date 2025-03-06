import { Orders } from '../models/Orders.js';
import { OrdersRepository } from '../repositories/Orders.js';
import { CustomersRepository } from '../repositories/Customers.js';
import { ProductRepository } from '../repositories/Products.js';

class OrdersService {
    constructor() {
        this.ordersRepository = new OrdersRepository();
        this.customersRepository = new CustomersRepository();
        this.productsRepository = new ProductRepository();
    }

    async createOrder(orderData) {
        try {
            if (!orderData) throw new Error('Pedido inválido');

            if (orderData.customerId === undefined) throw new Error('ID do cliente não fornecido');
            const customer = await this.customersRepository.findById(orderData.customerId);
            if (!customer) throw new Error('Cliente não encontrado ou não informado');
            
            // Check if products array exists and is not empty
            if (!orderData.products || !Array.isArray(orderData.products) || orderData.products.length === 0) {
                throw new Error('Produtos não fornecidos ou formato inválido');
            }

            // Validar e preparar os produtos para o pedido
            // Agora só é necessário fornecer o ID do produto e a quantidade
            for (const productItem of orderData.products) {
                if (!productItem.id) throw new Error('ID do produto não fornecido');
                if (!productItem.quantity) productItem.quantity = 1; // Default para 1 se quantidade não for fornecida
                
                // Verificar apenas se o produto existe
                const product = await this.productsRepository.findById(productItem.id);
                if (!product) throw new Error(`Produto com ID ${productItem.id} não encontrado`);
                
                // Não é mais necessário calcular os valores aqui, isso será feito no repositório
            }

            // Calcular o total do pedido se não foi fornecido
            if (!orderData.orderTotal) {
                let total = 0;
                for (const productItem of orderData.products) {
                    // Se o usuário já forneceu o preço final, use-o
                    if (productItem.finalPrice) {
                        total += productItem.finalPrice;
                    } 
                    // Caso contrário, busque o preço do produto e calcule
                    else {
                        const product = await this.productsRepository.findById(productItem.id);
                        total += product.price * productItem.quantity;
                    }
                }
                
                // Adicionar custo de frete se houver
                if (orderData.shipping && orderData.shipping.cost) {
                    total += orderData.shipping.cost;
                }
                
                orderData.orderTotal = total;
            }

            const newOrder = new Orders(orderData);
            return await this.ordersRepository.createOrder(newOrder);
        } catch (error) {
            throw new Error(`Erro ao criar pedido: ${error.message}`);
        }
    }
}

export { OrdersService };