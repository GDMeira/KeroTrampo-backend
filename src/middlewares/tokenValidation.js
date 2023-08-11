import db from "../database/database.connection.js"
import { findSessionByToken } from "../repositories/auth.repositories.js"

export async function tokenValidation(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send('Token inválido.')

    try {
        const session = await findSessionByToken(token);
        if (session.rowCount === 0) return res.status(401).send({message: 'Token inválido.'})

        res.locals = session.rows[0]

        next()
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}