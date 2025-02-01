import * as dbService from "../../DB/dbService.js";
import  { EventEmitter } from "events"
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/Models/user.model.js";
import { hash } from './../hashing/hash.js';

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async(email, userName, id) => {
    await sendCode({ 
        data: { userName, email, id }, 
        subjectType: subject.verifyEmail,
    });
});

emailEmitter.on("forgetPassword", async(email, userName, id) => {
    await sendCode({ 
        data: { userName, email, id }, 
        subjectType: subject.resetPassword,
    });
});

emailEmitter.on("updateEmail", async(email, userName, id) => {
    await sendCode({ 
        data: { userName, email, id },
        subjectType: subject.updateEmail,
    });
});


export const sendCode = async ({ 
    data = {}, 
    subjectType = subject.verifyEmail,
}) => {
    const { userName, email, id } = data;

    const otp = customAlphabet('0123456789', 6)();
    const hashedOtp = hash({ plainText: otp });

    let updateData = { };

    switch (subjectType) {
        case subject.verifyEmail:
            updateData = { confirmEmailOTP: hashedOtp };
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
        data: updateData,
    });

    const isSent = await sendEmail({
        to: email,
        subject: subjectType,
        html: signUpHTML(otp, userName, subjectType)
    });
};