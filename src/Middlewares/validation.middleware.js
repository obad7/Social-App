import joi from "joi";
import { Types } from "mongoose";
import { genderType } from "../DB/Models/user.model.js";


export const isValidObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("id is not valid");
};


export const validation = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        if (req.file || req.files?.length) {
            data.file = req.file || req.files;
        }
        const results = schema.validate(data, { abortEarly: false });
        if (results.error) {
            const errorMessage = results.error.details.map((obj) => obj.message);
            return next(new Error(errorMessage, { cause: 400 }));
        }
        return next();
    };
};

// general faileds object
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
    code: joi.string().pattern(new RegExp(/^[0-9]{6}$/)),
    id: joi.string().custom(isValidObjectId),
    DOB: joi.date().less("now"),
    gender: joi.string().valid(...Object.values(genderType)),
    address: joi.string(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    fileObject: {
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
    }
}