import { CustomersService } from "../services/Customers.js";

const ICustomersService = new CustomersService();

class CustomersController {

    async create(req, res, next) {
        try {
            const createdCustomer = await ICustomersService.create(req.body);
            return res.status(201).json({message: 'Client created successfully', createdCustomer});
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async insertAddress(req, res, next) {
        try {
            const { id } = req.params;
            const insertAddress = await ICustomersService.insertAddress(id, req.body);
            return res.status(200).json({message: 'Address updated successfully', insertAddress});
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async listAddress(req, res, next) {
        try {
            const { id } = req.params;
            const addresses = await ICustomersService.listAddresses(id);
            return res.status(200).json({addresses});
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updatedCustomer = await ICustomersService.update(id, req.body);
            return res.status(200).json({message: 'Client updated successfully', updatedCustomer});
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async createGroup(req, res, next) {
        try {
            const group = {
                name: req.body.name,
                discount: req.body.discount,
                minOrder: req.body.minOrder,
                maxOrder: req.body.maxOrder,
                freeShipping: req.body.freeShip,
                shippingBlock: req.body.shippBlocked || [],
                paymentRules: req.body.paymentRules || []
            };

            const result = await ICustomersService.createGroup(group);
            res.status(201).json(result);
        } catch (error) {
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export { CustomersController };