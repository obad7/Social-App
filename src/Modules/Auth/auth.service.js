import * as dbService from "../../DB/dbService.js";
import { roleType, UserModel, providersTypes } from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { hash, compareHash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";
import { tokenTypes, decodedToken } from "../../Middlewares/auth.middleware.js";
import { OAuth2Client } from "google-auth-library";

export const loginWithGmail = async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    }
    const { name, email, picture, email_verified } = await verify();

    if (!email_verified) return next(new Error("Email is not verified", { cause: 400 }));

    let user = await dbService.findOne({ model: UserModel, filter: { email } });

    // if user is already exists
    if (user?.providers === providersTypes.System)
        return next(new Error("User already exists", { cause: 400 }));

    // if user is not exists
    if (!user) {
        user = await dbService.create({
            model: UserModel,
            data: {
                userName: name,
                email,
                image: picture,
                confirmEmail: email_verified,
                providers: providersTypes.Google,
            },
        });
    }

    const sccessToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === roleType.User
                ? process.env.USER_ACCESS_TOKEN
                : process.env.ADMIN_ACCESS_TOKEN,
        options: { expiresIn: process.env.ACCSESS_TOKEN_EXPIRES },
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === roleType.User
                ? process.env.USER_REFRESH_TOKEN
                : process.env.ADMIN_REFRESH_TOKEN,
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES },
    });

    return res.status(200).json({
        success: true,
        tokens: { accessToken: sccessToken, refreshToken: refreshToken }
    });
}


export const register = async (req, res, next) => {
    const { userName, email, password } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (user) { return next(new Error("User already exists", { cause: 400 })) }

    // set changeCredentials to expire in 3 minutes
    // const expirationTime = new Date(Date.now() + 3 * 60 * 1000);

    const newUser = await dbService.create({
        model: UserModel,
        data: {
            userName,
            email,
            password: password,
            // changeCredentials: expirationTime,
        }
    });

    // emit email event
    const findNewUser = await dbService.findOne({ model: UserModel, filter: { email } });
    emailEmitter.emit("sendEmail", userName, email, findNewUser._id);

    return res.status(200).json({
        success: true,
        message: newUser,
    });
};


export const confirmEmail = async (req, res, next) => {
    const { email, code } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) { return next(new Error("User not found", { cause: 400 })) }

    if (user.confirmEmailOTP == true) { return next(new Error("Email already confirmed", { cause: 400 })) }

    // check if the code has expired
    // if (new Date() > user.changeCredentials)
    //     return next(new Error("code has expired, resend email", { cause: 400 }));

    if (!user.confirmEmailOTPExpiresAt || new Date() > user.confirmEmailOTPExpiresAt) {
        return next(new Error("Code has expired, please request a new one", { cause: 400 }));
    }

    // check if the code is valid
    if (!compareHash({ plainText: code, hash: user.confirmEmailOTP }))
        return next(new Error("Invalid code", { cause: 400 }))

    // update the user
    await dbService.updateOne({
        model: UserModel,
        filter: { email },
        data: {
            confirmEmail: true,
            $unset: {
                confirmEmailOTP: "",
                confirmEmailOTPExpiresAt: "",
                changeCredentials: "",
                emailResendCount: "",
                emailResendCooldown: "",
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: "Email confirmed successfully",
    });
};


// resend email code 
export const resendEmail = async (req, res, next) => {
    const { email } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    if (user.confirmEmail === true) return next(new Error("Email is already confirmed", { cause: 400 }));

    // Check if the user is in the cooldown period
    if (user.emailResendCooldown && new Date() < user.emailResendCooldown) {
        const waitTime = Math.ceil((user.emailResendCooldown - Date.now()) / 60000);
        return next(new Error(`Too many attempts. Please wait ${waitTime} minutes before trying again.`, { cause: 400 }));
    }

    const resendLimit = 3;
    const cooldownPeriod = 3 * 60 * 1000;

    // Check if the user has reached the resend limit
    let updatedResendCount = user.emailResendCount + 1;
    let newCooldown = user.emailResendCooldown;
    if (updatedResendCount > resendLimit) {
        updatedResendCount = 1;
        newCooldown = new Date(Date.now() + cooldownPeriod);
    }

    // Emit email event and update the user
    emailEmitter.emit("sendEmail", user.userName, user.email, user._id);

    await dbService.updateOne({
        model: UserModel,
        filter: { email },
        data: {
            emailResendCount: updatedResendCount,
            emailResendCooldown: newCooldown,
        }
    });

    return res.status(200).json({
        success: true,
        message: "A new confirmation email has been sent. Please check your inbox.",
    });
};


export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    if (!user.confirmEmail) return next(new Error("Email is not confirmed", { cause: 400 }));

    if (!compareHash({ plainText: password, hash: user.password }))
        return next(new Error("Invalid password", { cause: 400 }));

    const sccessToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === roleType.User
                ? process.env.USER_ACCESS_TOKEN
                : process.env.ADMIN_ACCESS_TOKEN,
        options: { expiresIn: process.env.ACCSESS_TOKEN_EXPIRES },
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === roleType.User
                ? process.env.USER_REFRESH_TOKEN
                : process.env.ADMIN_REFRESH_TOKEN,
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES },
    });

    return res.status(200).json({
        success: true,
        tokens: {
            accessToken: sccessToken,
            refreshToken: refreshToken,
        },
    });
};

export const refresh_token = async (req, res, next) => {
    const { authorization } = req.headers;

    const user = await decodedToken({
        authorization: authorization,
        tokenType: tokenTypes.refresh,
        next: next
    });

    const sccessToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === roleType.User
                ? process.env.USER_ACCESS_TOKEN
                : process.env.ADMIN_ACCESS_TOKEN
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === roleType.User
                ? process.env.USER_REFRESH_TOKEN
                : process.env.ADMIN_REFRESH_TOKEN
    });

    return res.status(200).json({
        success: true,
        tokens: {
            accessToken: sccessToken,
            refreshToken: refreshToken,
        },
    });
};


export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email, isDeleted: false } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    emailEmitter.emit("forgetPassword", email, user.userName);

    return res.status(200).json({
        success: true,
        message: "email sent successfully",
    });
}


export const resetPassword = async (req, res, next) => {
    const { email, code, password } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email, isDeleted: false } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    if (!compareHash({ plainText: code, hash: user.forgetPasswordOTP }))
        return next(new Error("Invalid code", { cause: 400 }));

    await dbService.updateOne({
        model: UserModel,
        filter: { email },
        data: {
            password: password,
            $unset: { forgetPasswordOTP: "" }
        }
    });

    return res.status(200).json({
        success: true,
        message: "Password reseted successfully",
    });
}
