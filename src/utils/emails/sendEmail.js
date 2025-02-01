import nodemailer from "nodemailer";

const sendEmail = async ({to, subject, html}) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = await transporter.sendMail({    
        from: `"Social Media App" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        html,
    });
    return message.rejected.length === 0 ? true : false;
};

export const subject = {
    resetPassword: "Reset Password",
    verifyEmail: "Activate your account",
    updateEmail: "Update your email",
}

export default sendEmail;