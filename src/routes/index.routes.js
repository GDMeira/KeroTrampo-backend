import authRouter from "./auth.routes";

const { Router } = require("express");

const router = Router();

router.use(authRouter);

export default router