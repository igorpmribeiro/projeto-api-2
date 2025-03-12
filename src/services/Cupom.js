import { CupomRepository } from "../repositories/Cupom.js";
import { Cupons } from "../models/Cupom.js";

class CupomServices {
    constructor() {
        this.cupomRepository = new CupomRepository();
    }

    async createCupom(cupomData) {
        const cupom = new Cupons(cupomData);
        const id = await this.cupomRepository.createCupom(cupom);
        return id;
    }
}

export { CupomServices };