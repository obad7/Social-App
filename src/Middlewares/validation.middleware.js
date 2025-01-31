import joi from "joi";
import { Types } from "mongoose";


export const isValidObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("id is not valid");
};


export const validation = (schema) =>{
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        const results = schema.validate(data, { abortEarly: false });
        if (results.error) {
            const errorMessage = results.error.details.map((obj) => obj.message);
            return next(new Error(errorMessage, { cause: 400 }));
        }
        return next();
    };
};


export const generalFaileds = {
    userName: joi.string().min(3).max(30),
    email: joi
        .string()
        .email({
            minDomainSegments: 2, 
            maxDomainSegments: 2, 
            tlds: { allow: ["com", "net"] }
        }),
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref('password')),
    code: joi.string().pattern(new RegExp(/^[0-9]{5}$/)),
    id: joi.string().custom(isValidObjectId),
}