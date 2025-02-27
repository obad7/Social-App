import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

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

export const updatePasswordSchema = joi.object({
    oldPassword: generalFaileds.password.required(),
    password: generalFaileds.password.not(joi.ref('oldPassword')).required(),
    confirmPassword: generalFaileds.confirmPassword.required(),
}).required();

export const updateProfileSchema = joi.object({
    userName: generalFaileds.userName,
    gender: generalFaileds.gender,
    address: generalFaileds.address,
    phone: generalFaileds.phone,
    DOB: generalFaileds.DOB,
}).required();

export const sendFriendRequsetSchema = joi.object({
    friendId: generalFaileds.id.required(),
}).required();

export const acceptFriendRequsetSchema = joi.object({
    friendId: generalFaileds.id.required(),
}).required();