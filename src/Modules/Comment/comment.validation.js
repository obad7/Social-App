import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const createCommentSchema = joi.object({
    text: joi.string().min(2).max(5000),
    file: joi.object(generalFaileds.fileObject),
    postId: generalFaileds.id.required(),
}).or('text', 'file');

export const updateCommentSchema = joi.object({
    text: joi.string().min(2).max(5000),
    file: joi.object(generalFaileds.fileObject),
    commentId: generalFaileds.id.required(),
}).or('text', 'file');