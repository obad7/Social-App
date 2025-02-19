import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";
import commentRouter from "../Comment/comment.controller.js";

const router = Router();

// mergeParams
router.use("/:postId/comment", commentRouter);

// create post
router.post(
    "/createPost",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().array("images", 5),
    validation(postValidation.createPostSchema),
    asyncHandler(postService.createPost)
);

// update post
router.patch(
    "/update/:postId",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().array("images", 5),
    validation(postValidation.updatePostSchema),
    asyncHandler(postService.updatePost)
);

// delete post
router.patch(
    "/softDelete/:postId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(postValidation.softDeletePostSchema),
    asyncHandler(postService.softDelete)
);

// restore post
router.patch(
    "/restorePost/:postId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(postValidation.restorePostSchema),
    asyncHandler(postService.restorePost)
);

// get single post
router.get(
    "/getSinglePost/:postId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(postValidation.getSinglePostSchema),
    asyncHandler(postService.getSinglePost)
);

// get all active posts
router.get(
    "/activePosts",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(postService.activePosts)
);

// get all freezed posts
router.get(
    "/freezedPosts",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(postService.freezedPosts)
);

// like & unlike post
router.patch(
    "/like_unlike/:postId",
    authentication(),
    allowTo(["User"]),
    validation(postValidation.likeAndUnlikeSchema),
    asyncHandler(postService.like_unlike)
);
export default router;