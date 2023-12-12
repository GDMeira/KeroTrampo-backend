import { nanoid } from "nanoid";
import { createSession, createUser, findUserByEmail } from "../repositories/auth.repositories.js";
import bcrypt from 'bcrypt';

async function signup(newUser) {
    const salt = 10;
    newUser.password = bcrypt.hashSync(newUser.password, salt);

    await createUser(newUser);
}

async function signin(user) {
    const dbUser = await findUserByEmail(user.email);
    const userInfo = dbUser.rows[0];
    if (dbUser.rowCount === 0) return res.status(401).send({ message: 'Usuário ou senha inválidos.' })
    if (!bcrypt.compareSync(user.password, userInfo.password)) return res.status(401).send({ message: 'Usuário ou senha inválidos.' })

    const token = nanoid();
    delete userInfo.password;
    await createSession(userInfo.id, token);

    return { token, ...userInfo };
}

async function signout(userId) {
    await deleteSession(userId);
}

export const authServices = {
    signup,
    signin,
    signout
}