import * as dbService from "../../DB/dbService.js";
import  { EventEmitter } from "events"
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/Models/user.model.js";
import { hash } from './../hashing/hash.js';

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async( userName, email, id) => {
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
    console.log("userID",id);

    const otp = customAlphabet('0123456789', 6)();
    const hashedOtp = hash({ plainText: otp });

    console.log("Generated OTP:", otp);
    console.log("Hashed OTP:", hashedOtp);

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

    console.log("updateData:", updateData);

    const user = await dbService.updateOne({ 
        model: UserModel, 
        filter: { _id: id }, 
        data: updateData,
    });

    console.log("Updated user in DB:", user);

    const isSent = await sendEmail({
        to: email,
        subject: subjectType,
        html: signUpHTML(otp, userName, subjectType)
    });
};