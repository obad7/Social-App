import joi from 'joi';
import { generalFaileds } from '../../Middlewares/validation.middleware.js';

export const registerSchema = joi.object({
    userName: generalFaileds.userName.required(),
    email: generalFaileds.email.required(),
    password: generalFaileds.password.required(),
    confirmPassword: generalFaileds.confirmPassword.required(),
}).required();

