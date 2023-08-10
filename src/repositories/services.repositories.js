import db from "../database/database.connection.js";

export function readServices() {
    return db.query(`
        SELECT s.id, s.mean_cost AS "meanCost", s.name, s.description, categories.name AS category, i.url
        FROM services_images
        JOIN images AS i ON services_images.image_id = i.id
        JOIN services AS s ON services_images.service_id = s.id
        JOIN categories ON s.category_id = categories.id
        WHERE s.is_visible = true;
    `)
}