import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const createChatSchema = joi.object({
    friendId: generalFaileds.id.required(),
}).required();