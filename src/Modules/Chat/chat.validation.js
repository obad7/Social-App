import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const getChatSchema = joi.object({
    friendId: generalFaileds.id.required(),
}).required();

export const sendMessageSchema = joi.object({
    friendId: generalFaileds.id.required(),
    content: joi.string().required(),
}).required();
