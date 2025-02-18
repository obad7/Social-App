import { Router } from "express";
import * as adminService from "./admin.service.js";
import * as adminValidation from "./admin.validation.js"
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { allowTo, authentication } from './../../Middlewares/auth.middleware.js';
import { changeRoleMiddleware } from "./admin.middleware.js";
const router = Router();

// get all posts & users
router.get(
    "/getAllPostsAndUsers",
    authentication(),
    allowTo(["Admin"]),
    asyncHandler(adminService.getAllPostsAndUsers)
);

// change roles
router.patch(
    "/changeRole",
    authentication(),
    allowTo(["Admin"]),
    validation(adminValidation.changeRoleSchema),
    changeRoleMiddleware,
    asyncHandler(adminService.changeRole)
);



export default router;