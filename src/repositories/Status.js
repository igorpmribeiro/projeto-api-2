import { db } from '../config/knexfile.js';

class StatusRepository {
	async getStatus() {
		try {
			const status = await db('orders_status').select('*');
			return status;
		} catch (error) {
			throw new Error(`Error to get status: ${error.message}`);
		}
	}

	async createStatus(status) {
		try {
			const newStatus = await db('orders_status').insert(status);
			const createdStatus = await db('orders_status').where('id', newStatus[0]);
			return createdStatus;
		} catch (error) {
			throw new Error(`Error to create status: ${error.message}`);
		}
	}

	async updateStatus(id, status) {
		try {
			const existingStatus = await db('orders_status').where('id', id).first();
			if (!existingStatus) {
				throw new Error('Status not found');
			}
			const updateStatus = {
				title: status.title ?? existingStatus.title,
				color: status.color ?? existingStatus.color,
			};
			await db('orders_status').where('id', id).update(updateStatus);
			const updatedStatus = await db('orders_status').where('id', id).first();
			return updatedStatus;
		} catch (error) {
			throw new Error(`Error to update status: ${error.message}`);
		}
	}

	async deleteStatus(id) {
		try {
			const existingStatus = await db('orders_status').where('id', id).first();
			if (!existingStatus) {
				return { status: 404, message: 'Status not found' };
			}
			await db('orders_status').where('id', id).del();
			return { status: 200, message: 'Status deleted successfully', id: id };
		} catch (error) {
			throw new Error(`Error to delete status: ${error.message}`);
		}
	}
}

export { StatusRepository };
