import { readAllParams, readServiceDetails, readServices, readServicesByCategories } from "../repositories/services.repositories.js";
import { ApplicationError } from "../utils/constants.js";

async function getServices(queryParams) {
    const { search, priceMin, priceMax, category, city, state } = queryParams;

    const services = await readServices(search, priceMin, priceMax, category, city, state);

    return services.rows
}

async function getServiceDetails(serviceId) {
    const service = await readServiceDetails(serviceId);
    if (service.rowCount === 0) throw new ApplicationError('Trampo não encontrado.', 404);

    return service.rows
}

async function getAllParams() {
    const params = await readAllParams();

    return params.rows[0];
}

async function getServicesByCategories() {
    const services = await readServicesByCategories();

    return services.rows
}

export const servicesServices = {
    getServices,
    getServiceDetails,
    getAllParams,
    getServicesByCategories
}