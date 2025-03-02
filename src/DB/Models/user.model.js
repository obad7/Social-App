import mongoose, { Schema, model, Types } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";

export const roleType = {
    Admin: "Admin",
    User: "User",
};

export const genderType = {
    Male: "Male",
    Female: "Female"
};

// ProvidersTypes to login with social media or system
export const providersTypes = {
    System: "System",
    Google: "Google",
};

// Disk Storage
export const defultImage = "uploads\\Default_image.jpg";

// Cloud Storage
export const defultImageOnCloud =
    "https://res.cloudinary.com/dt83ykbei/image/upload/v1738976103/Default_image_wykjm1.jpg";
export const defultPublicId =
    "Default_image_pawsie";

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
            secure_url: {
                type: String,
                default: defultImageOnCloud
            },
            public_id: {
                type: String,
                default: defultPublicId
            }
        },

        // Disk Storage
        // image: { type: String, default: defultImage },
        // coverImages: [String],

        providers: {
            type: String,
            enum: Object.values(providersTypes),
            default: providersTypes.System,
        },

        confirmEmail: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        changeCredentials: Date,
        confirmEmailOTP: String,
        confirmEmailOTPExpiresAt: {
            type: Date,
            index: { expires: 60 }, // TTL index deletes document after 60s
        },

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

        friendRequest: [{ type: Types.ObjectId, ref: "User" }],
        friends: [{ type: Types.ObjectId, ref: "User" }],


    },
    { timestamps: true }
);

// pre hook to hash password
userSchema.pre("save", function (next) {
    // if password is modified hash -> if not return next
    if (this.isModified("password")) {
        this.password = hash({ plainText: this.password })
    }
    return next();
});

export const UserModel = mongoose.model.User || model("User", userSchema);