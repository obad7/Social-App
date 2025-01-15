import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
const router = Router();


export default router;