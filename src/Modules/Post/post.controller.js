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

router.patch(
    "/update/:postId",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().array("images", 5),
    validation(postValidation.updatePostSchema),
    asyncHandler(postService.updatePost)
);

router.patch(
    "/softDelete/:postId",
    authentication(),
    allowTo(["User", "Admin"]),
    uploadOnCloud().array("images", 5),
    validation(postValidation.softDeletePostSchema),
    asyncHandler(postService.softDelete)
);

export default router;