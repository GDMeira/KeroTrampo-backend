import db from "../database/database.connection.js";

export function readUserServices(userId) {
    return db.query(`
        SELECT s.id, s.mean_cost AS "meanCost", s.name, s.is_visible AS "isVisible", i.url
        FROM services AS s
        JOIN images AS i ON s.main_image_id = i.id
        WHERE s.user_id = $1;
    `, [userId])
}

export function readServiceDetails(serviceId) {
    return db.query(`
        SELECT 
            s.user_id AS "userId",
            s.mean_cost AS "meanCost",
            s.name AS name,
            s.description AS description,
            s.is_visible AS "isVisible",
            categories.name AS category,
            json_agg(json_build_object('id', i.id, 'url', i.url)) AS images,
            target_regions.target AS "targetRegion",
            (
                SELECT json_agg(categories.name) FROM categories
            ) AS categories,
            (
                SELECT json_agg(target_regions.target) FROM target_regions
            ) AS targets,
            (
				SELECT images.url 
				FROM images 
				JOIN services ON images.id = services.main_image_id
				WHERE services.id = 1
			) AS "mainImage"
        FROM services_images
        JOIN images AS i ON services_images.image_id = i.id
        JOIN services AS s ON services_images.service_id = s.id
        JOIN categories ON s.category_id = categories.id
        JOIN target_regions ON s.target_region_id = target_regions.id
        WHERE s.id = $1
        GROUP BY s.mean_cost, s.name, s.description, categories.name,
        target_regions.target, s.user_id, s.is_visible;
    `, [serviceId])
}

export function findServiceById(serviceId) {
    return db.query(`
        SELECT user_id AS "userId"
        FROM services
        WHERE services.id = $1;
    `, [serviceId])
}

export function readSavedImages(serviceId) {
    return db.query(`
        SELECT services_images.image_id AS id, images.url
        FROM services_images
        JOIN images ON images.id = services_images.image_id
        WHERE services_images.service_id = $1;
    `, [serviceId])
}

export function deleteImages(imagesId, serviceId) {
    return db.query(`
        DELETE FROM services_images
        USING images
        WHERE services_images.service_id = $1
        AND images.id = services_images.image_id
        AND images.id = ANY($2);
    `, [serviceId, imagesId]);
}

export function createImages(images, serviceId) {
    return db.query(`
        WITH inserted_images AS (
            INSERT INTO images (url)
            VALUES
                ${images.map((_, index) => `($${index + 2})`).join(', ')}
            RETURNING id
        )
        INSERT INTO services_images (service_id, image_id)
        SELECT
            $1, id
        FROM inserted_images;
    `, [serviceId, ...images.map(image => image.url)]);
}

export function updateImages(images) {
    const arrayImages = [];
    images.forEach(image => {
        arrayImages.push(image.id);
        arrayImages.push(image.url);
    });

    return db.query(`
        UPDATE images AS i
        SET url = c.url
        FROM (
            VALUES ${arrayImages.map((_, index) => `($${2 * index + 1}, $${2 * index + 2})`).join(', ')}
        ) AS c(id, url)
        WHERE i.id = c.id; 
    `, arrayImages);
}

export function updateService(info, serviceId) {
    return db.query(`
        UPDATE services
        SET 
            name = $2,
            description = $3,
            mean_cost = $4,
            is_visible = $5,
            category_id = (
                SELECT c.id FROM categories AS c WHERE c.name = $6
            ),
            target_region_id = (
                SELECT t.id FROM target_regions AS t WHERE t.target = $7
            ),
            main_image_id = COALESCE(
                (
                    SELECT images.id
                    FROM images
                    JOIN services_images ON images.id = services_images.image_id AND services_images.service_id = $1
                    WHERE images.url = $8
                ),
                main_image_id
            )
        WHERE services.id = $1;
    `, [serviceId, info.name, info.description, info.meanCost, info.isVisible, info.category, info.targetRegion,
        info.mainImage]);
}

export function readParams() {
    return db.query(`
    SELECT 
        (
            SELECT json_agg(categories.name) FROM categories
        ) AS categories,
        (
            SELECT json_agg(target_regions.target) FROM target_regions
        ) AS targets;
    `)
}

export function createService(info, userId) {
    return db.query(`
        INSERT INTO services (name, description, mean_cost, is_visible, category_id, target_region_id, user_id)
        VALUES( 
            $1, $2, $3, $4, (
                SELECT c.id FROM categories AS c WHERE c.name = $5
            ), (
                SELECT t.id FROM target_regions AS t WHERE t.target = $6
            ),
            $7
        )
        RETURNING id;
    `, [info.name, info.description, info.meanCost, info.isVisible, info.category, info.targetRegion, userId]);
}

export function setMainImage(mainImage, serviceId) {
    return db.query(`
        UPDATE services
        SET 
            main_image_id = COALESCE(
                (
                    SELECT images.id
                    FROM images
                    JOIN services_images ON images.id = services_images.image_id AND services_images.service_id = $1
                    WHERE images.url = $2
                ),
                main_image_id
            )
        WHERE services.id = $1;
    `, [serviceId, mainImage]);
}