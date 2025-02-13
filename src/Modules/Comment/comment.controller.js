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
router.post(
    "/",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().single("image"),
    validation(commentValidation.createCommentSchema),
    asyncHandler(commentService.createComment)
);

router.patch(
    "/:commentId",
    authentication(),
    allowTo(["User"]),
    uploadOnCloud().single("image"),
    validation(commentValidation.updateCommentSchema),
    asyncHandler(commentService.updateComment)
);

router.patch(
    "/softDelete/:commentId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(commentValidation.softDeleteCommentSchema),
    asyncHandler(commentService.softDeleteComment)
);

// mergeParams
// post/:postId/comment
router.get(
    "/",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(commentValidation.getAllCommentsSchema),
    asyncHandler(commentService.getAllComments)
);


export default router;