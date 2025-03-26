import { StatusRepository } from '../repositories/Status.js';
import { Status } from '../models/Status.js';

const IStatusRepository = new StatusRepository();

class StatusService {
	async getStatus() {
		try {
			const status = await IStatusRepository.getStatus();
			return status;
		} catch (error) {
			throw new Error(`Error to get status: ${error.message}`);
		}
	}

	async createStatus(status) {
		try {
			const newStatus = new Status(status);
			const createdStatus = await IStatusRepository.createStatus(newStatus);
			return createdStatus;
		} catch (error) {
			throw new Error(`Error to create status: ${error.message}`);
		}
	}

	async updateStatus(id, status) {
		try {
			const updatedStatus = await IStatusRepository.updateStatus(id, status);
			return updatedStatus;
		} catch (error) {
			throw new Error(`Error to update status: ${error.message}`);
		}
	}

	async deleteStatus(id) {
		try {
			const deleteStatus = await IStatusRepository.deleteStatus(id);
			return deleteStatus;
		} catch (error) {
			throw new Error(`Error to delete status: ${error.message}`);
		}
	}
}

export { StatusService };
