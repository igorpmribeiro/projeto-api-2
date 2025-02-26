import { db } from "../config/knexfile.js";

class CustomersRepository {
    async create(customer) {
        const { address, ...customerData } = customer;
        try {
            const [id] = await db("customers").insert({
                ...customerData
            });

            if (address && address.length > 0) {
                await db("customers_address").insert(
                    address.map((addr) => ({
                        customers_id: id,
                        entry_gender: customer.customers_gender,
                        entry_firstname: customer.customers_firstname,
                        entry_lastname: customer.customers_lastname,
                        ...addr
                    }))
                );
            }

            return {

            };
        } catch (error) {
            console.error("Error creating customer:", error);
            throw new Error(`Error creating customer: ${error.message}`);
        }
    }

    async insertAddress(id, address) {
        try {
            const existingAddress = await db("customers_address").where({ customers_id: id }).first();
            if (!existingAddress) {
                throw new Error("Address not found.");
            }
            await db('customers_address').insert({
                customers_id: id,
                entry_firstname: address.firstname,
                entry_lastname: address.lastname,
                entry_gender: address.gender,
                entry_street_address: address.street,
                entry_street_number: address.number,
                entry_street_complemento: address.complement,
                entry_postcode: address.postcode,
                entry_suburb: address.suburb,
                entry_city: address.city
            });
                


            return { message: "Address created successfully." };
        } catch (error) {
            console.error("Error inserting address:", error);
            throw new Error(`Error inserting address: ${error.message}`);
        }
    }

    async listAddresses(id) {
        try {
            const addresses = await db("customers_address").where({ customers_id: id });
            if (addresses.length === 0) {
                throw new Error("No addresses found for this customer.");
            }
            return addresses;
        } catch (error) {
            console.error("Error listing addresses:", error);
            throw new Error(`Error listing addresses: ${error.message}`);
        }
    }

    async update(id, customer) {
        try {
            const existingCustomer = await db("customers").where({ customers_id: id }).first();
            const updatedCustomer = await db("customers").where({ customers_id: id }).update({
                customers_tipo_pessoa: customer.type ? customer.type : existingCustomer.customers_tipo_pessoa,
                customers_email_address: customer.email ? customer.email : existingCustomer.customers_email_address,
                customers_firstname: customer.firstname ? customer.firstname : existingCustomer.customers_firstname,
                customers_lastname: customer.lastname ? customer.lastname : existingCustomer.customers_lastname,
                customers_cpf_cnpj: customer.cpfCnpj ? customer.cpfCnpj : existingCustomer.customers_cpf_cnpj,
                customers_dob: customer.dob ? customer.dob : existingCustomer.customers_dob,
                customers_rg: customer.rg ? customer.rg : existingCustomer.customers_rg,
                customers_ddd1: customer.ddd ? customer.ddd : existingCustomer.customers_ddd1,
                customers_telephone: customer.telephone ? customer.telephone : existingCustomer.customers_telephone,
                customers_gender: customer.gender ? customer.gender : existingCustomer.customers_gender
            });

            console.log(customer.address);

            if (customer.address) {
                await db("customers_address").update({
                    entry_firstname: customer.address.firstname,
                    entry_lastname: customer.address.lastname,
                    entry_gender: customer.address.gender,
                    entry_street_address: customer.address.street,
                    entry_street_number: customer.address.number,
                    entry_street_complemento: customer.address.complement,
                    entry_postcode: customer.address.postcode,
                    entry_suburb: customer.address.suburb,
                    entry_city: customer.address.city
                }).where({customers_id: id}).where({address_book_id: customer.address_id});
            }

            return updatedCustomer;

        } catch (error) {
            console.error("Error updating customer:", error);
            throw new Error(`Error updating customer: ${error.message}`);
        }
    }

    async createGroup(group) {
        try {
            const [id] = await db("customers_group").insert({
                name: group.name,
                discount: group.discount,
                min_order: group.minOrder,
                max_order: group.maxOrder,
                free_ship: group.freeShip ? 1 : 0,
                shipp_blocked: JSON.stringify(group.shippingBlock),
                payment_rules: JSON.stringify(group.paymentRules),
            });

            return { message: "Group created successfully." };
        } catch (error) {
            console.error("Error creating group:", error);
            throw new Error(`Error creating group: ${error.message}`);
        }
    }

}

export { CustomersRepository };