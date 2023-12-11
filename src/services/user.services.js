import {
    createImages,
    createService,
    deleteImages,
    findServiceById,
    readParams,
    readSavedImages,
    readServiceDetails,
    readUserServices,
    setMainImage,
    updateImages,
    updateService
} from "../repositories/user.repositories.js";
import { ApplicationError } from "../utils/constants.js";

async function getUserServices(userId) {
    const services = await readUserServices(userId);

    return services.rows
}

async function getServiceDetails(serviceId, userId) {
    const service = await readServiceDetails(serviceId);
    if (service.rowCount === 0) throw new ApplicationError('Trampo não encontrado.', 404);
    if (service.rows[0].userId !== userId) throw new ApplicationError('Acesso negado!', 409);

    delete service.rows[0].userId;

    return service.rows[0];
}

async function putServiceDetails(serviceId, userId, info) {
    if (userId !== (await findServiceById(serviceId)).rows[0].userId) throw new ApplicationError('Acesso negado!', 409);

    let savedImages = await readSavedImages(serviceId);
    savedImages = savedImages.rows;
    const deletedImagesId = savedImages.filter(sImg => !info.images.some(image => image.id === sImg.id)).map(img => img.id);
    const createdImages = info.images.filter(image => image.id < 0);
    const updatedImages = info.images.filter(image => image.id > 0 && image.url !== savedImages.find(img => img.id === image.id).url);

    if (deletedImagesId.length > 0) await deleteImages(deletedImagesId, serviceId)
    if (createdImages.length > 0) await createImages(createdImages, serviceId)
    if (updatedImages.length > 0) await updateImages(updatedImages)
    await updateService(info, serviceId)
}

async function getParams() {
    const params = await readParams();

    return params.rows[0];
}

async function postService(info, userId) {
    const id = (await createService(info, userId)).rows[0].id;
    await createImages(info.images, id);
    await setMainImage(info.mainImage, id);
}

export const userServices = {
    getUserServices,
    getServiceDetails,
    putServiceDetails,
    getParams,
    postService
}
