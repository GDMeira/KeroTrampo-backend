import { Router } from "express";
import { getAllParams, getServiceDetails, getServices, getServicesByCategories } from "../controllers/services.controllers.js";

const servicesRouter = Router()

servicesRouter.get('/services', getServices);
servicesRouter.get('/services/:id', getServiceDetails);
servicesRouter.get('/services-params', getAllParams);
servicesRouter.get('/services-by-categories', getServicesByCategories);

export default servicesRouter