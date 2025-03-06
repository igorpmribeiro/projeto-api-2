import { Customers, CustomersAddress, CustomersGroup } from '../models/Customers.js';
import { CustomersRepository } from '../repositories/Customers.js';

class CustomersService {
    constructor() {
        this.customersRepository = new CustomersRepository();
    }

    async create(customerData) {
        try {;
            if (errors.length > 0) {
                throw new Error(`Dados inválidos: ${errors.join('; ')}`);
            }
            
            const newCustomer = new Customers(customerData);
            return await this.customersRepository.create(newCustomer);
        } catch (error) {
            throw new Error(`Erro ao criar cliente: ${error.message}`);
        }
    }

    async insertAddress(id, address) {
        try {
            if (!id) throw new Error('ID do cliente é obrigatório');
            if (!address) throw new Error('Dados do endereço são obrigatórios');
            
            // Validando o endereço usando as regras do validador
            const errors = this.validator.validateObject(address, this.validator.addressRules);
            if (errors.length > 0) {
                throw new Error(`Dados de endereço inválidos: ${errors.join('; ')}`);
            }
            
            return await this.customersRepository.insertAddress(id, address);
        } catch (error) {
            throw new Error(`Erro ao inserir endereço: ${error.message}`);
        }
    }

    async listAddresses(id) {
        try {
            if (!id) throw new Error('ID do cliente é obrigatório');
            return await this.customersRepository.listAddresses(id);
        } catch (error) {
            throw new Error(`Erro ao listar endereços: ${error.message}`);
        }
    }

    async update(id, customer) {
        try {
            if (!id) throw new Error('ID do cliente é obrigatório');
            if (!customer) throw new Error('Dados do cliente são obrigatórios');
            
            // Usando o método específico de validação para atualizações
            const errors = this.validator.validateUpdate(customer);
            if (errors.length > 0) {
                throw new Error(`Dados inválidos: ${errors.join('; ')}`);
            }
            
            return await this.customersRepository.update(id, customer);
        } catch (error) {
            throw new Error(`Erro ao atualizar cliente: ${error.message}`);
        }
    }

    async createGroup(group) {
        try {
            if (!group) throw new Error('Dados do grupo são obrigatórios');
            
            // Usando o método específico de validação para grupos
            const errors = this.validator.validateGroup(group);
            if (errors.length > 0) {
                throw new Error(`Dados de grupo inválidos: ${errors.join('; ')}`);
            }
            
            return await this.customersRepository.createGroup(group);
        } catch (error) {
            throw new Error(`Erro ao criar grupo: ${error.message}`);
        }
    }
}

export { CustomersService };