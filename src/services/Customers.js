import { Customers, CustomersAddress } from '../models/Customers.js';
import { CustomersRepository } from '../repositories/Customers.js';

class CustomersService {
    constructor() {
        this.customersRepository = new CustomersRepository();
    }

    async create(customerData) {
        try {
            if (!customerData) throw new Error('Cliente inválido');
            const newCustomer = new Customers(customerData);
            return await this.customersRepository.create(newCustomer);
        } catch (error) {
            throw new Error(`Erro ao criar cliente: ${error.message}`);
        }
    }

    async insertAddress(id, address) {
        try {
            if (!id || !address) throw new Error('Customer no exists');
            return await this.customersRepository.insertAddress(id, address);
        } catch (error) {
            throw new Error(`Erro ao inserir endereço: ${error.message}`);
        }
    }

    async listAddresses(id) {
        try {
            if (!id) throw new Error('Customer no exists');
            return await this.customersRepository.listAddresses(id);
        } catch (error) {
            throw new Error(`Erro ao listar endereços: ${error.message}`);
        }
    }

    async update(id, customer) {
        try {
            if (!id || !customer) throw new Error('Cliente inválido');
            return await this.customersRepository.update(id, customer);
        } catch (error) {
            throw new Error(`Erro ao atualizar cliente: ${error.message}`);
        }
    }

    async createGroup(group) {
        try {
            if (!group) throw new Error('Grupo inválido');
            return await this.customersRepository.createGroup(group);
        } catch (error) {
            throw new Error(`Erro ao criar grupo: ${error.message}`);
        }
    }
}

export { CustomersService };