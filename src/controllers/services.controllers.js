import { readServiceDetails, readServices } from "../repositories/services.repositories.js";

export async function getServices(req, res) {
    try {
        const services = await readServices();
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
        if (service.rowsCount === 0) return res.status(404).send({message: 'Serviço não encontrado.'})

        res.send(service.rows)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}