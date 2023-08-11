import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { getServiceDetails, getUserServices, putServiceDetails } from "../controllers/user.controllers.js";
import { stringStripHtml } from "../middlewares/stringStripHtmlValidation.js";

const userRouter = Router()

userRouter.get('/user/services', tokenValidation, getUserServices);
userRouter.get('/user/services/:id', tokenValidation, getServiceDetails);
userRouter.put('/user/services/:id', tokenValidation, stringStripHtml, putServiceDetails);

export default userRouter