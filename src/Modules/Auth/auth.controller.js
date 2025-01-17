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


router.patch(
    "/varyfyEmail",
    validation(authValdation.confirmEmailSchema),
    asyncHandler(authService.confirmEmail)
);


router.patch(
    "/resendEmail",
    validation(authValdation.resendEmailSchema),
    asyncHandler(authService.resendEmail)
);


export default router;