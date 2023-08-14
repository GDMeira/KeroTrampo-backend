import { readAllParams, readServiceDetails, readServices, readServicesByCategories } from "../repositories/services.repositories.js";

export async function getServices(req, res) {
    const { search, priceMin, priceMax, category, city, state } = req.query;

    try {
        const services = await readServices(search, priceMin, priceMax, category, city, state);
        res.send(services.rows)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getServiceDetails(req, res) {
    const id = req.params.id;
    if (!Number(id) || Number(id) < 1) return res.status(422).send({message: 'id do serviço não é válido.'})

    try {
        const service = await readServiceDetails(id);
        if (service.rowCount === 0) return res.status(404).send({message: 'Trampo não encontrado.'})

        res.send(service.rows)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getAllParams(req, res) {
    try {
        const params = await readAllParams();
        res.send(params.rows[0]);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getServicesByCategories(req, res) {

    try {
        const services = await readServicesByCategories();
        res.send(services.rows)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}