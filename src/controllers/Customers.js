import { CustomersService } from '../services/Customers.js';
import { CustomersValidator } from '../validators/Customers.js';

const ICustomersService = new CustomersService();
const ICustomersValidator = new CustomersValidator();

class CustomersController {
	async create(req, res, next) {
		try {
			const validationResult = ICustomersValidator.validate(req.body);
			if (!validationResult.isValid) {
				return res.status(400).json({ error: validationResult.errors });
			}
			const createdCustomer = await ICustomersService.create(req.body);
			return res
				.status(201)
				.json({ message: 'Client created successfully', createdCustomer });
		} catch (error) {
			return next(error);
		}
	}

	async insertAddress(req, res, next) {
		try {
			const { id } = req.params;
			const addressValidationResult = ICustomersValidator.validateAddress(
				req.body,
			);
			if (!addressValidationResult.isValid) {
				return res.status(400).json({ error: addressValidationResult.errors });
			}
			const insertAddress = await ICustomersService.insertAddress(id, req.body);
			return res
				.status(200)
				.json({ message: 'Address updated successfully', insertAddress });
		} catch (error) {
			return next(error);
		}
	}

	async listAddress(req, res, next) {
		try {
			const { id } = req.params;
			const addresses = await ICustomersService.listAddresses(id);
			return res.status(200).json({ addresses });
		} catch (error) {
			return next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			// Para update, validamos apenas os campos presentes na requisição
			const errors = {};
			for (const field in req.body) {
				if (ICustomersValidator.validationRules[field]) {
					const rule = ICustomersValidator.validationRules[field];
					const error = ICustomersValidator.validateField(
						field,
						req.body[field],
						rule.required,
					);
					if (error) {
						errors[field] = error;
					}
				}
			}

			if (Object.keys(errors).length > 0) {
				return res.status(400).json({ error: errors });
			}

			const updatedCustomer = await ICustomersService.update(id, req.body);
			return res
				.status(200)
				.json({ message: 'Client updated successfully', updatedCustomer });
		} catch (error) {
			return next(error);
		}
	}

	async createGroup(req, res, next) {
		try {
			// Validações básicas para group
			const group = {
				name: req.body.name,
				discount: req.body.discount,
				minOrder: req.body.minOrder,
				maxOrder: req.body.maxOrder,
				freeShipping: req.body.freeShip,
				shippingBlock: req.body.shippBlocked || [],
				paymentRules: req.body.paymentRules || [],
			};

			if (!group.name) {
				return res
					.status(400)
					.json({ error: { name: 'Nome do grupo é obrigatório' } });
			}

			if (
				group.discount !== undefined &&
				(typeof group.discount !== 'number' ||
					group.discount < 0 ||
					group.discount > 100)
			) {
				return res.status(400).json({
					error: { discount: 'Desconto deve ser um número entre 0 e 100' },
				});
			}

			const result = await ICustomersService.createGroup(group);
			res.status(201).json(result);
		} catch (error) {
			return next(error);
		}
	}
}

export { CustomersController };
