import { Router } from "express";
import { getServiceDetails, getServices } from "../controllers/services.controllers.js";

const servicesRouter = Router()

servicesRouter.get('/services', getServices);
servicesRouter.get('/services/:id', getServiceDetails);

export default servicesRouter