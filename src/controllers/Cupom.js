import { CupomServices } from "../services/Cupom.js";

const ICupomServices = new CupomServices();

class CupomController {
    async createCupom(req, res, next) {
        try {
            const cupomData = req.body;
            const id = await ICupomServices.createCupom(cupomData);
            res.status(201).json({ message: 'Cupom created successfully', id });
        } catch (error) {
            next(error);
        }
    }
}

export { CupomController };