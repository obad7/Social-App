import joi from 'joi';
import { generalFaileds } from '../../Middlewares/validation.middleware.js';

export const registerSchema = joi.object({
    userName: generalFaileds.userName.required(),
    email: generalFaileds.email.required(),
    password: generalFaileds.password.required(),
    confirmPassword: generalFaileds.confirmPassword.required(),
}).required();


export const confirmEmailSchema = joi.object({
    email: generalFaileds.email.required(),
    code: generalFaileds.code.required(),
}).required();


export const resendEmailSchema = joi.object({
    email: generalFaileds.email.required(),
}).required();


export const loginSchema = joi.object({
    email: generalFaileds.email.required(),
    password: generalFaileds.password.required(),
}).required();