import { StatusRepository } from '../repositories/Status.js';

const IStatusRepository = new StatusRepository();

class StatusController {
	async getStatus(res, next) {
		try {
			const status = await IStatusRepository.getStatus();
			res.status(200).json({ status: 200, result: [status] });
		} catch (error) {
			next(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	async createStatus(req, res, next) {
		try {
			const status = req.body;

			const createdStatus = await IStatusRepository.createStatus(status);
			res.status(201).json({ status: 200, result: createdStatus });
		} catch (error) {
			next(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	async updateStatus(req, res, next) {
		try {
			const { id } = req.params;
			const status = req.body;

			if (!id) {
				return res.status(400).json({ message: 'ID is required' });
			}
			if (!status) {
				return res.status(400).json({ message: 'Status is required' });
			}

			const updatedStatus = await IStatusRepository.updateStatus(id, status);
			res.status(200).json({ status: 200, result: updatedStatus });
		} catch (error) {
			next(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	async deleteStatus(req, res, next) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ message: 'ID is required' });
			}
			const deletedStatus = await IStatusRepository.deleteStatus(id);
			if (deletedStatus.status === 404) {
				return res.status(404).json({ error: deletedStatus });
			}
			res.status(200).json({ result: deletedStatus });
		} catch (error) {
			next(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export { StatusController };
