import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as authValdation from "../Auth/auth.validation.js"
const router = Router();

router.post(
    "/register",
    validation(authValdation.registerSchema),
    asyncHandler(authService.register)
);

export default router;