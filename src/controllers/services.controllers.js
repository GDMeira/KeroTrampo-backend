import { servicesServices } from "../services/services.services.js";

export async function getServices(req, res) {
    try {
        const services = await servicesServices.getServices(req.query);

        res.send(services)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getServiceDetails(req, res) {
    const id = req.params.id;
    if (!Number(id) || Number(id) < 1) return res.status(422).send({message: 'id do serviço não é válido.'})

    try {
        const service = await servicesServices.getServiceDetails(id);
        
        res.send(service)
    } catch (error) {
        if (error instanceof ApplicationError) return res.status(error.statusCode).send({message: error.message});
        res.status(500).send({message: error.message});
    }
}

export async function getAllParams(_req, res) {
    try {
        const params = await servicesServices.getAllParams();

        res.send(params);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getServicesByCategories(_req, res) {
    try {
        const services = await servicesServices.getServicesByCategories();

        res.send(services)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}