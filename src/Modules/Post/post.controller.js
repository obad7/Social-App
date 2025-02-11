import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();

router.post(
    "/createPost",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().array("images", 5),
    validation(postValidation.createPostSchema),
    asyncHandler(postService.createPost)
);


export default router;