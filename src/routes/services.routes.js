import { Router } from "express";
import { getAllParams, getServiceDetails, getServices } from "../controllers/services.controllers.js";

const servicesRouter = Router()

servicesRouter.get('/services', getServices);
servicesRouter.get('/services/:id', getServiceDetails);
servicesRouter.get('/services-params', getAllParams);

export default servicesRouter