import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { getParams, getServiceDetails, getUserServices, postService, putServiceDetails } from "../controllers/user.controllers.js";
import { stringStripHtml } from "../middlewares/stringStripHtmlValidation.js";

const userRouter = Router()

userRouter.get('/user/services', tokenValidation, getUserServices);
userRouter.get('/user/services/:id', tokenValidation, getServiceDetails);
userRouter.put('/user/services/:id', tokenValidation, stringStripHtml, putServiceDetails);
userRouter.get('/user/services-params', tokenValidation, getParams);
userRouter.post('/user/new-service', tokenValidation, stringStripHtml, postService);


export default userRouter