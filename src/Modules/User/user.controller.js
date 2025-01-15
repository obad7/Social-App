import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userValidation from "./user.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
const router = Router();



export default router;