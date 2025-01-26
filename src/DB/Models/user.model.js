import mongoose, { Schema, model } from "mongoose";

export const roleType = {
    admin: "Admin",
    user: "User",
};
export const genderType = {
    male: "Male",
    female: "Female"
};

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            minLength: [3, "Username must be at least 3 characters long"],
            maxLength: [300, "Username must be at most 30 characters long"],
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        gender: {
            type: String,
            enum: Object.values(genderType),
            default: genderType.male,
        },

        role: {
            type: String,
            enum: Object.values(roleType),
            default: roleType.user,
        },

        confirmEmail: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        changeCredentials: Date,
        confirmEmailOTP: String,
        
        phone: String,
        address: String,
        DOB: Date,
        image: String,
        coverImage: [String],

        emailResendCount: { type: Number, default: 0 },
        emailResendCooldown: Date,
    },
    { timestamps: true }
);

export const UserModel = mongoose.model.User || model("User", userSchema);