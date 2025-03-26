import { CupomRepository } from '../repositories/Cupom.js';
import { Cupons } from '../models/Cupom.js';

const ICupomRepository = new CupomRepository();

class CupomServices {
	async createCupom(cupomData) {
		const cupom = new Cupons(cupomData);
		const createdCupom = await ICupomRepository.createCupom(cupom);
		return createdCupom;
	}

	async getCoupons() {
		const coupons = await ICupomRepository.getCoupons();
		return coupons;
	}
}

export { CupomServices };
