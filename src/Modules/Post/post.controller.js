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
    validation(postValidation.softDeletePostSchema),
    asyncHandler(postService.softDelete)
);

router.patch(
    "/restorePost/:postId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(postValidation.restorePostSchema),
    asyncHandler(postService.restorePost)
);

router.get(
    "/getSinglePost/:postId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(postValidation.getSinglePostSchema),
    asyncHandler(postService.getSinglePost)
);

router.get(
    "/activePosts",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(postService.activePosts)
);

router.get(
    "/freezedPosts",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(postService.freezedPosts)
);

router.patch(
    "/like_unlike/:postId",
    authentication(),
    allowTo(["User"]),
    validation(postValidation.likeAndUnlikeSchema),
    asyncHandler(postService.like_unlike)
);
export default router;