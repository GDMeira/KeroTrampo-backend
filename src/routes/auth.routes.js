import { Router } from "express";
import { stringStripHtml } from "../middlewares/stringStripHtmlValidation.js";
import { postUser } from "../controllers/auth.controllers.js";


const authRouter = Router()

authRouter.post('/signup', stringStripHtml, postUser);

export default authRouter