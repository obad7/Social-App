import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as authValdation from "../Auth/auth.validation.js"
const router = Router();

// login with google
router.get(
    "/loginWithGmail",
    asyncHandler(authService.loginWithGmail)
);

// register
router.post(
    "/register",
    validation(authValdation.registerSchema),
    asyncHandler(authService.register)
);

// confirm email
router.patch(
    "/varyfyEmail",
    validation(authValdation.confirmEmailSchema),
    asyncHandler(authService.confirmEmail)
);

// resend confirm email
router.patch(
    "/resendEmail",
    validation(authValdation.resendEmailSchema),
    asyncHandler(authService.resendEmail)
);

// login
router.post(
    "/login",
    validation(authValdation.loginSchema),
    asyncHandler(authService.login)
);

// refresh token
router.get(
    "/refresh_token",
    asyncHandler(authService.refresh_token)
);

// forget password
router.patch(
    "/forget_password",
    validation(authValdation.forgetPasswordSchema),
    asyncHandler(authService.forgetPassword)
);

// reset password
router.patch(
    "/reset_password",
    validation(authValdation.resetPasswordSchema),
    asyncHandler(authService.resetPassword)
);


export default router;