import { authServices } from '../services/auth.services.js';

export async function signup(req, res) {
    const newUser = req.body;

    try {
        await authServices.signup(newUser);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}

export async function signin(req, res) {
    const user = req.body;

    try {
        const response = await authServices.signin(user);

        res.send(response);
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}

export async function signout(_req, res) {
    try {
        await authServices.signout(res.locals.userId);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}