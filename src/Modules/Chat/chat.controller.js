import { Router } from "express";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as chatService from "./chat.service.js";
import * as chatValidation from "./chat.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";

const router = Router();

// create chat between two users
router.get(
    "/:friendId",
    authentication(),
    allowTo(["User"]),
    validation(chatValidation.createChatSchema),
    asyncHandler(chatService.getChat)
);

export default router;