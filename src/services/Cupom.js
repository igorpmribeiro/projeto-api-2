import { CupomRepository } from '../repositories/Cupom.js';
import { Cupons } from '../models/Cupom.js';

class CupomServices {
	constructor() {
		this.ICupomRepository = new CupomRepository();
	}
	async createCupom(cupomData) {
		const cupom = new Cupons(cupomData);
		const createdCupom = await this.ICupomRepository.createCupom(cupom);
		return createdCupom;
	}

	async getCoupons() {
		const coupons = await this.ICupomRepository.getCoupons();
		return coupons;
	}
}

export { CupomServices };
