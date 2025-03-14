import {
	Customers,
	CustomersAddress,
	CustomersGroup,
} from '../models/Customers.js';
import { CustomersRepository } from '../repositories/Customers.js';

class CustomersService {
	constructor() {
		this.customersRepository = new CustomersRepository();
	}

	async create(customer) {
		try {
			if (!customer) throw new Error('Dados do cliente são obrigatórios');
			const newCustomer = new Customers(customer);
			return await this.customersRepository.create(newCustomer);
		} catch (error) {
			throw new Error(`Erro ao criar cliente: ${error.message}`);
		}
	}

	async insertAddress(id, address) {
		try {
			if (!id) throw new Error('ID do cliente é obrigatório');
			if (!address) throw new Error('Dados do endereço são obrigatórios');
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
			return await this.customersRepository.update(id, customer);
		} catch (error) {
			throw new Error(`Erro ao atualizar cliente: ${error.message}`);
		}
	}

	async createGroup(group) {
		try {
			if (!group) throw new Error('Dados do grupo são obrigatórios');
			return await this.customersRepository.createGroup(group);
		} catch (error) {
			throw new Error(`Erro ao criar grupo: ${error.message}`);
		}
	}
}

export { CustomersService };
