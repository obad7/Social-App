import { Router } from "express";
import * as commentService from "./comment.service.js";
import * as commentValidation from "./comment.validation.js"
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { allowTo, authentication } from './../../Middlewares/auth.middleware.js';
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";
const router = Router({ mergeParams: true });

// mergeParams
// post/:postId/comment
// create comment
router.post(
    "/",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().single("image"),
    validation(commentValidation.createCommentSchema),
    asyncHandler(commentService.createComment)
);

// update comment
router.patch(
    "/:commentId",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().single("image"),
    validation(commentValidation.updateCommentSchema),
    asyncHandler(commentService.updateComment)
);

// soft delete comment
router.patch(
    "/softDelete/:commentId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(commentValidation.softDeleteCommentSchema),
    asyncHandler(commentService.softDeleteComment)
);

// mergeParams
// post/:postId/comment
// get all comments
router.get(
    "/",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(commentValidation.getAllCommentsSchema),
    asyncHandler(commentService.getAllComments)
);

// like & unlike comment
router.patch(
    "/like_unlike/:commentId",
    authentication(),
    allowTo(["User"]),
    validation(commentValidation.likeAndUnlikeSchema),
    asyncHandler(commentService.like_unlike)
);

// mergeParams
// post/:postId/comment/:commentId
// add reply to comment
router.post(
    "/:commentId",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().single("image"),
    validation(commentValidation.addReplySchema),
    asyncHandler(commentService.addReply)
);

// hard delete comment
router.delete(
    "/:commentId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(commentValidation.deleteCommentSchema),
    asyncHandler(commentService.hardDelete)
);


export default router;