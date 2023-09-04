import db from "../database/database.connection.js";

export function createUser(user) {
    return db.query(`/* SQL */
        INSERT INTO users (email, password, name, phone, main_image_url)
        VALUES ($1, $2, $3, $4, $5)
    `, [user.email, user.password, user.name, user.phone, user.image])
}

export function findUserByEmail(email) {
    return db.query(`/* SQL */
        SELECT 
            u.id, u.password, u.main_image_url AS image, u.name AS name,
            u.is_provider as "isProvider", u.description, u.phone
        FROM users AS u
        WHERE email = $1
    `, [email])
}

export function createSession(id, token) {
    return db.query(`/* SQL */
        INSERT INTO sessions
        (user_id, token) VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE
        SET token = $2, created_at = NOW(); 
    `, [id, token])
}

export function findSessionByToken(token) {
    return db.query(`/* SQL */
            SELECT id, user_id AS "userId", token 
            FROM sessions
            WHERE token = $1;
        `, [token]);
}

export function deleteSession(userId) {
    return db.query(`/* SQL */
        DELETE FROM sessions WHERE user_id = $1;
    `, [userId]);
}