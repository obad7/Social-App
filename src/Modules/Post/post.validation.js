import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const createPostSchema = joi.object({
    content: joi.string().min(2).max(5000),
    file: joi.array().items(joi.object(generalFaileds.fileObject)),
}).or('content', 'file');
// (or) is a joi method that allows you to specify that at least one of the fields must be present

export const updatePostSchema = joi.object({
    postId: generalFaileds.id.required(),
    content: joi.string().min(2).max(5000),
    file: joi.array().items(joi.object(generalFaileds.fileObject)),
}).or('content', 'file');

export const softDeletePostSchema = joi.object({
    postId: generalFaileds.id.required(),
});

export const restorePostSchema = joi.object({
    postId: generalFaileds.id.required(),
});

export const getSinglePostSchema = joi.object({
    postId: generalFaileds.id.required(),
});

export const likeAndUnlikeSchema = joi.object({
    postId: generalFaileds.id.required(),
});

