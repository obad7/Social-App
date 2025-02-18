import joi from "joi";
import { roleType } from "../../DB/Models/user.model.js";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const changeRoleSchema = joi.object({
    userId: generalFaileds.id.required(),
    role: joi.string().valid(...Object.values(roleType)).required(),
}).required();