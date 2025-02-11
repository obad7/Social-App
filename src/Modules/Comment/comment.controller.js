import { Router } from "express";
import * as commentService from "./comment.service.js";
import * as commentValidation from "./comment.validation.js"
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { allowTo, authentication } from './../../Middlewares/auth.middleware.js';
const router = Router();

router.post(
    "/createComment",
    authentication(),
    allowTo(["User"]),
    validation(commentValidation.createCommentSchema),
    asyncHandler(commentService.createComment)
);


export default router;