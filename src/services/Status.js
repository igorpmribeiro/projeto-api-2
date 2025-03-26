import { StatusRepository } from '../repositories/Status.js';
import { Status } from '../models/Status.js';

class StatusService {
	constructor() {
		this.IStatusRepository = new StatusRepository();
	}
	async getStatus() {
		try {
			const status = await this.IStatusRepository.getStatus();
			return status;
		} catch (error) {
			throw new Error(`Error to get status: ${error.message}`);
		}
	}

	async createStatus(status) {
		try {
			const newStatus = new Status(status);
			const createdStatus = await this.IStatusRepository.createStatus(newStatus);
			return createdStatus;
		} catch (error) {
			throw new Error(`Error to create status: ${error.message}`);
		}
	}

	async updateStatus(id, status) {
		try {
			const updatedStatus = await this.IStatusRepository.updateStatus(id, status);
			return updatedStatus;
		} catch (error) {
			throw new Error(`Error to update status: ${error.message}`);
		}
	}

	async deleteStatus(id) {
		try {
			const deleteStatus = await this.IStatusRepository.deleteStatus(id);
			return deleteStatus;
		} catch (error) {
			throw new Error(`Error to delete status: ${error.message}`);
		}
	}
}

export { StatusService };
