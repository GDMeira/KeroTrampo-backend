import db from "../database/database.connection.js";

export function readServices() {
    return db.query(`
        SELECT s.id, s.mean_cost AS "meanCost", s.name, s.description, categories.name AS category, i.url
        FROM services AS s
        JOIN images AS i ON s.main_image_id = i.id
        JOIN categories ON s.category_id = categories.id
        WHERE s.is_visible = true;
    `)
}

export function readServiceDetails(id) {
    return db.query(`
        SELECT 
        json_build_object(
            'meanCost', s.mean_cost,
            'name', s.name,
            'description', s.description,
            'category', categories.name,
            'url', json_agg(i.url),
            'targetRegion', target_regions.target
        ) AS service,
        json_build_object(
            'name', u.name,
            'phone', u.phone,
            'image', u.main_image_url,
            'description', u.description,
            'city', cities.name,
            'stateAcronym', states.acronym,
            'state', states.name
        ) AS provider
        FROM services_images
        JOIN images AS i ON services_images.image_id = i.id
        JOIN services AS s ON services_images.service_id = s.id
        JOIN categories ON s.category_id = categories.id
        JOIN target_regions ON s.target_region_id = target_regions.id
        JOIN users AS u ON u.id = s.user_id
        JOIN adress ON u.id = adress.user_id
        JOIN cities ON cities.id = adress.city_id
        JOIN states ON cities.state_id = states.id
        WHERE s.is_visible = true AND s.id = $1
        GROUP BY s.mean_cost, s.name, s.description, categories.name,
        target_regions.target, u.name, u.phone, u.main_image_url, u.description,
        cities.name, states.acronym, states.name;
    `, [id])
}