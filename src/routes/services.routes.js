import { Router } from "express";
import { getServices } from "../controllers/services.controllers.js";

const servicesRouter = Router()

servicesRouter.get('/services', getServices);

export default servicesRouter