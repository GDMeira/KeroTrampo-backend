import { userServices } from "../services/user.services.js";
import { ApplicationError } from "../utils/constants.js";

export async function getUserServices(_req, res) {
    try {
        const services = await userServices.getUserServices(res.locals.userId);

        res.send(services)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getServiceDetails(req, res) {
    const id = req.params.id;
    if (!Number(id) || Number(id) < 1) return res.status(422).send({message: 'id do serviço não é válido.'})

    try {
        const service = await userServices.getServiceDetails(id, res.locals.userId);

        res.send(service);
    } catch (error) {
        if (error instanceof ApplicationError) return res.status(error.statusCode).send({message: error.message});

        res.status(500).send({message: error.message});
    }
}

export async function putServiceDetails(req, res) {
    const id = req.params.id;
    if (!Number(id) || Number(id) < 1) return res.status(422).send({message: 'id do serviço não é válido.'})
    const info = req.body;

    try {
        await userServices.putServiceDetails(id, res.locals.userId, info);

        res.sendStatus(204);
    } catch (error) {
        if (error instanceof ApplicationError) return res.status(error.statusCode).send({message: error.message});
        res.status(500).send({message: error.message});
    }
}

export async function getParams(_req, res) {
    try {
        const params = await userServices.getParams();

        res.send(params);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function postService(req, res) {
    const info = req.body;

    try {
        await userServices.postService(info, res.locals.userId);

        res.sendStatus(201);
    } catch (error) {
        if (error instanceof ApplicationError) return res.status(error.statusCode).send({message: error.message});
        res.status(500).send({message: error.message});
    }
}

export async function postAddress(req, res) {
    const info = req.body;

    try {
        const address = await userServices.postAddress(info, res.locals.userId);

        res.status(201).send(address);
    } catch (error) {
        if (error instanceof ApplicationError) return res.status(error.statusCode).send({message: error.message});
        res.status(500).send({message: error.message});
    }
}