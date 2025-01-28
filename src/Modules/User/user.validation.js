import joi from "joi";
import {generalFaileds} from "../../Middlewares/validation.middleware.js";

export const shareProfileSchema = joi.object({
    profileId: generalFaileds.id.required(),
}).required();