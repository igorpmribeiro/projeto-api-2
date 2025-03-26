import { CupomServices } from '../services/Cupom.js';

const ICupomServices = new CupomServices();

class CupomController {
	async createCupom(req, res, next) {
		try {
			const cupomData = req.body;
			const createdCupom = await ICupomServices.createCupom(cupomData);
			res.status(201).json({ message: 'Cupom created successfully', createdCupom });
		} catch (error) {
			next(error);
		}
	}

	async getCoupons(req, res, next) {
		try {
			const coupons = await ICupomServices.getCoupons();
			if (coupons.length === 0) {
				return res.status(404).json({
					message: 'No coupons found or none are currently active in the system.',
				});
			}
			res.status(200).json({ status: 200, coupons_active: coupons.length, coupons });
		} catch (error) {
			next(error);
			res.status(500).json({ message: 'Error retrieving coupons' });
		}
	}
}

export { CupomController };
