import { readServices } from "../repositories/services.repositories.js";

export async function getServices(req, res) {
    try {
        const services = await readServices();
        res.send(services.rows)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}