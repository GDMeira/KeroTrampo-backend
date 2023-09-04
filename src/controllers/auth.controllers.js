import bcrypt from 'bcrypt';
import { createSession, createUser, deleteSession, findUserByEmail } from '../repositories/auth.repositories.js';
import { nanoid } from 'nanoid';

export async function signup(req, res) {
    const newUser = req.body;
    const salt = 10;
    newUser.password = bcrypt.hashSync(newUser.password, salt);

    try {
        await createUser(newUser);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}

export async function signin(req, res) {
    const user = req.body;

    try {
        const dbUser = await findUserByEmail(user.email);
        const userInfo = dbUser.rows[0];
        if (dbUser.rowCount === 0) return res.status(401).send({message: 'Usuário ou senha inválidos.'})
        if (!bcrypt.compareSync(user.password, userInfo.password)) return res.status(401).send({message: 'Usuário ou senha inválidos.'})

        const token = nanoid();
        delete userInfo.password;
        await createSession(userInfo.id, token);

        res.send({token, ...userInfo});
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}

export async function signout(req, res) {
    console.log(res.locals)
    try {
        await deleteSession(res.locals.userId);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}