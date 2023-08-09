import { Router } from "express";
import { stringStripHtml } from "../middlewares/stringStripHtmlValidation.js";
import { signup, signin } from "../controllers/auth.controllers.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { signinSchema, signupSchema } from "../schemas/auth.schemas.js";


const authRouter = Router()

authRouter.post('/signup', stringStripHtml, schemaValidation(signupSchema), signup);
authRouter.post('/signin', stringStripHtml, schemaValidation(signinSchema), signin);

export default authRouter