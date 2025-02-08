import mongoose, { Schema, model, Types } from "mongoose";

export const roleType = {
    Admin: "Admin",
    User: "User",
};

export const genderType = {
    Male: "Male",
    Female: "Female"
};

export const defultImage = "uploads\\Default_image.jpg";

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
            default: genderType.Male,
        },

        role: {
            type: String,
            enum: Object.values(roleType),
            default: roleType.User,
        },

        // Cloud Storage
        image: {
            secure_url: String,
            public_id: String
        },

        // Disk Storage
        // image: { type: String, default: defultImage },
        // coverImages: [String],

        confirmEmail: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        changeCredentials: Date,
        confirmEmailOTP: String,
        
        phone: String,
        address: String,
        DOB: Date,

        emailResendCount: { type: Number, default: 0 },
        emailResendCooldown: Date,
        forgetPasswordOTP: String,

        viewers: [
            {
                userId: { type: Types.ObjectId, ref: "User" },
                time: Date,
            }   
        ],

        tempEmail: String,
        tampEmailOTP: String,
        
    },
    { timestamps: true }
);

export const UserModel = mongoose.model.User || model("User", userSchema);