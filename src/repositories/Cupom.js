import { db } from '../config/knexfile.js';

class CupomRepository {
	async createCupom(cupom) {
		// Garantindo que temos regras válidas
		const regras = cupom.regras || {
			customers: [],
			categories: [],
			products: [],
		};

		const [id] = await db('coupons').insert({
			codigo_cupom: cupom.code,
			nome_cupom: cupom.name, // Corrigido para nome_cupom conforme schema
			cupom_description: cupom.description,
			tipo_cupom: cupom.type,
			cupom_value: cupom.value,
			max_discount: cupom.max_discount,
			max_customer_use: cupom.max_customer_use,
			produto_brinde: JSON.stringify(cupom.products) || null,
			data_inicio: cupom.start_date, // Usando a data como string para evitar NaN
			data_fim: cupom.end_date, // Usando a data como string para evitar NaN
			cliente_exclusivo: JSON.stringify(regras.customers),
			categoria_exclusiva: JSON.stringify(regras.categories),
			produto_exclusivo: JSON.stringify(regras.products), // Corrigido para produto_exclusivo (singular)
		});

		return { id, code: cupom.code };
	}

	async getCoupons() {
		const coupons = await db('coupons').select(
			'cupom_id',
			'codigo_cupom',
			'nome_cupom',
			'cupom_description',
			'tipo_cupom',
			'cupom_value',
			'max_discount',
			'max_customer_use',
			'produto_brinde',
			'data_inicio',
			'data_fim',
			'cliente_exclusivo',
			'categoria_exclusiva',
			'produto_exclusivo',
		);
		const currentDate = new Date();
		return coupons.filter((coupon) => new Date(coupon.data_fim) > currentDate);
	}
}

export { CupomRepository };
