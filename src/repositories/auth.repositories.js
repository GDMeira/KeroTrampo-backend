import db from "../database/database.connection.js";

export function createUser(user) {
    return db.query(`
        INSERT INTO users (email, password, name, phone, main_image_url)
        VALUES ($1, $2, $3, $4, $5)
    `, [user.email, user.password, user.name, user.phone, user.image])
}

export function findUserByEmail(email) {
    return db.query(`
        SELECT u.id, u.password
        FROM users AS u
        WHERE email = $1
    `, [email])
}

export function createSession(id, token) {
    return db.query(`
        INSERT INTO sessions
        (user_id, token) VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE
        SET token = $2, created_at = NOW(); 
    `, [id, token])
}

export function findSessionByToken(token) {
    return db.query(`
            SELECT id, user_id AS "userId", token 
            FROM sessions
            WHERE token = $1;
        `, [token]);
}