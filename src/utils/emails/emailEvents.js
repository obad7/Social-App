import  { EventEmitter } from "events"
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/Models/user.model.js";
import { hash } from './../hashing/hash.js';

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async(email, userName) => {

    const otp = customAlphabet('0123456789', 5)();

    const hashedOtp = hash({ plainText: otp });

    await UserModel.updateOne({ email }, { confirmEmailOTP: hashedOtp });

    const isSent = await sendEmail({
        to: email,
        subject: subject.verifyEmail,
        html: signUpHTML(otp, userName)
    });

    if (!isSent) return next(new Error("Failed to send email", { cause: 500 }));
});
