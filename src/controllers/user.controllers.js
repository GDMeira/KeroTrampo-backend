import { 
    createImages, 
    createService, 
    deleteImages, 
    findServiceById, 
    readParams, 
    readUserServices, 
    setMainImage, 
    updateImages,
    updateService
 } from "../repositories/user.repositories.js";

export async function getUserServices(req, res) {
    try {
        const services = await readUserServices(res.locals.userId);
        res.send(services.rows)
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getServiceDetails(req, res) {
    const id = req.params.id;
    if (!Number(id) || Number(id) < 1) return res.status(422).send({message: 'id do serviço não é válido.'})

    try {
        const service = await readServiceDetails(id);
        if (service.rowCount === 0) return res.status(404).send({message: 'Trampo não encontrado.'});
        if (service.rows[0].userId !== res.locals.userId) return res.status(409).send({message: 'Acesso negado.'});

        delete service.rows[0].userId;
        res.send(service.rows[0]);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function putServiceDetails(req, res) {
    const id = req.params.id;
    if (!Number(id) || Number(id) < 1) return res.status(422).send({message: 'id do serviço não é válido.'})
    if (res.locals.userId !== (await findServiceById(id)).rows[0].userId) return res.status(409).send({message: 'Acesso negado.'})
    const info = req.body;

    try {
        let savedImages = await readSavedImages(id);
        savedImages = savedImages.rows;
        const deletedImagesId = savedImages.filter(sImg => !info.images.some(image => image.id === sImg.id)).map(img => img.id);
        const createdImages = info.images.filter(image => image.id < 0);
        const updatedImages = info.images.filter(image => image.id > 0 && image.url !== savedImages.find(img => img.id === image.id).url);

        if (deletedImagesId.length > 0) await deleteImages(deletedImagesId, id)
        if (createdImages.length > 0) await createImages(createdImages, id)
        if (updatedImages.length > 0) await updateImages(updatedImages)
        await updateService(info, id)

        res.sendStatus(204);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function getParams(req, res) {
    try {
        const params = await readParams();
        res.send(params.rows[0]);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function postService(req, res) {
    const info = req.body;

    try {
        const id = (await createService(info, res.locals.userId)).rows[0].id;
        await createImages(info.images, id);
        await setMainImage(info.mainImage, id);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}