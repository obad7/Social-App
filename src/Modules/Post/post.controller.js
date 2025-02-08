import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();

router.post(
    "/create",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(postService.createPost)
);


export default router;