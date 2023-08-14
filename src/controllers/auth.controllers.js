import bcrypt from 'bcrypt';
import { createSession, createUser, findUserByEmail } from '../repositories/auth.repositories.js';
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
        if (dbUser.rowCount === 0) return res.status(404).send({message: 'email não cadastrado.'})
        if (!bcrypt.compareSync(user.password, dbUser.rows[0].password)) return res.status(401).send({message: 'Senha incorreta.'})

        const token = nanoid();
        await createSession(dbUser.rows[0].id, token);

        res.send({token});
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}