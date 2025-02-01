import joi from "joi";
import {generalFaileds} from "../../Middlewares/validation.middleware.js";

export const shareProfileSchema = joi.object({
    profileId: generalFaileds.id.required(),
}).required();

export const updateEmailSchema = joi.object({
    email: generalFaileds.email.required(),
}).required();

export const resetEmailSchema = joi.object({
    oldCode: generalFaileds.code.required(),
    newCode: generalFaileds.code.required(),
}).required();

