import * as dbService from "../../DB/dbService.js";
import { EventEmitter } from "events"
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/Models/user.model.js";
import { hash } from './../hashing/hash.js';

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async (userName, email, id) => {
    await sendCode({
        data: { userName, email, id },
        subjectType: subject.verifyEmail,
    });
});

emailEmitter.on("forgetPassword", async (email, userName, id) => {
    await sendCode({
        data: { userName, email, id },
        subjectType: subject.resetPassword,
    });
});

emailEmitter.on("updateEmail", async (email, userName, id) => {
    await sendCode({
        data: { userName, email, id },
        subjectType: subject.updateEmail,
    });
});


//This code generates a 6-digit One-Time Password (OTP), hashes it, 
// and updates a user's document in the database with the hashed OTP. 
// then sends an email to the user with the OTP and a subject line 
// based on the subjectType parameter, which can be one of three 
// types: verify email, reset password, or update email.
export const sendCode = async ({
    data = {},
    subjectType = subject.verifyEmail,
}) => {
    try {
        const { userName, email, id } = data;

        const otp = customAlphabet('0123456789', 6)();
        const hashedOtp = hash({ plainText: otp });

        let updateData = {};

        switch (subjectType) {
            case subject.verifyEmail:
                updateData = {
                    confirmEmailOTP: hashedOtp,
                    confirmEmailOTPExpiresAt: new Date(Date.now() + 60 * 1000) // Ensure OTP expires in 60s
                };
                break;
            case subject.resetPassword:
                updateData = { forgetPasswordOTP: hashedOtp };
                break;
            case subject.updateEmail:
                updateData = { tampEmailOTP: hashedOtp };
                break;
            default:
                break;
        }

        await dbService.updateOne({
            model: UserModel,
            filter: { _id: id },
            data: { ...updateData },
        });

        const isSent = await sendEmail({
            to: email,
            subject: subjectType,
            html: signUpHTML(otp, userName, subjectType)
        });

    } catch (error) {
        console.log(error);
    }

};