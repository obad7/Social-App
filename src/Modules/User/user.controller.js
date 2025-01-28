import { Router } from "express";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userValidation from "./user.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";

const router = Router();

router.post(
    "/profile",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(userService.getProfile)
);


router.get(
    "/profile/:profileId",
    validation(userValidation.shareProfileSchema),
    authentication(),
    asyncHandler(userService.shareProfile)
)


export default router;