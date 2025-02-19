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


router.post(
    "/login",
    validation(authValdation.loginSchema),
    asyncHandler(authService.login)
);


router.get(
    "/refresh_token",
    asyncHandler(authService.refresh_token)
);


router.patch(
    "/forget_password",
    validation(authValdation.forgetPasswordSchema),
    asyncHandler(authService.forgetPassword)
);


router.patch(
    "/reset_password",
    validation(authValdation.resetPasswordSchema),
    asyncHandler(authService.resetPassword)
);

router.get(
    "/loginWithGmail",
    asyncHandler(authService.loginWithGmail)
);


export default router;