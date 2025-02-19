import * as dbService from "../../DB/dbService.js";
import { defultImage, UserModel, defultImageOnCloud, defultPublicId } from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { hash, compareHash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";

export const getProfile = async (req, res, next) => {
    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: req.user._id, isDeleted: false },
        populate: {
            path: "viewers.userId",
            select: "userName email image -_id",
        },
    });

    return res.status(200).json({ success: true, user });
};


export const shareProfile = async (req, res, next) => {
    const { profileId } = req.params;
    let user = undefined;

    if (profileId == req.user._id.toString()) {
        user = req.user;
    } else {
        user = await dbService.findOneAndUpdate({
            model: UserModel,
            filter: { _id: profileId, isDeleted: false },
            data: {
                $push: {
                    viewers: {
                        userId: req.user._id,
                        time: Date.now(),
                    },
                },
            },
            select: "userName email image",
        });
    }

    return user
        ? res.status(200).json({ success: true, data: { user } })
        : next(new Error("User not found", { cause: 404 }));
};


export const updateEmail = async (req, res, next) => {
    const { email } = req.body;

    if (await dbService.findOne({ model: UserModel, filter: { email } }))
        return next(new Error("Email already exists", { cause: 400 }));

    await dbService.updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        data: { tempEmail: email },
    });

    emailEmitter.emit(
        "sendEmail",
        req.user.email,
        req.user.userName,
        req.user._id,
    );

    emailEmitter.emit(
        "updateEmail",
        email,
        req.user.userName,
        req.user._id,
    );

    return res.status(200).json({
        success: true,
        data: {},
    });
};


export const resetEmail = async (req, res, next) => {
    const { oldCode, newCode } = req.body;

    // check if the code is valid
    if (
        !compareHash({ plainText: oldCode, hash: req.user.confirmEmailOTP }) ||
        !compareHash({ plainText: newCode, hash: req.user.tampEmailOTP })
    ) { return next(new Error("Invalid code", { cause: 400 })); }

    const user = await dbService.updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        data: {
            email: req.user.tempEmail,
            changeCredentials: Date.now(),
            $unset: {
                confirmEmailOTP: "",
                tempEmail: "",
                tampEmailOTP: "",
            }
        }
    });

    return res.status(200).json({
        success: true,
        data: { user },
    });
};


export const updateProfile = async (req, res, next) => {
    // encrypt phone
    if (req.body.phone) {
        req.body.phone = encrypt({
            plainText: req.body.phone,
            signature: process.env.ENCRYPTION_KEY,
        });
    }

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        data: { ...req.body },
        options: { new: true, runValidators: true },
    })

    return res.status(200).json({
        success: true,
        data: { user },
    });
};


export const updatePassword = async (req, res, next) => {
    const { oldPassword, password } = req.body;

    if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
        return next(new Error("Invalid password", { cause: 400 }));

    const user = await dbService.updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        data: {
            password: hash({ plainText: password }),
            changeCredentials: Date.now(),
        }
    });

    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
};

//////////////////////////////////////////////////////////////////////////
// Disk storage

export const uploadImageOnDisk = async (req, res, next) => {
    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        data: { image: req.file.path },
        options: { new: true },
    });

    return res.status(200).json({
        success: true,
        data: { user },
    });
};


export const uploadMultipleImagesOnDisk = async (req, res, next) => {

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        data: { coverImages: req.files.map((file) => file.path) },
        options: { new: true },
    });

    return res.status(200).json({
        success: true,
        data: { user },
    });
};


export const deleteProfilePicture = async (req, res, next) => {
    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    })

    const imagePath = path.resolve(".", user.image);
    fs.unlinkSync(imagePath);
    user.image = defultImage;

    await user.save();

    return res.status(200).json({
        success: true,
        data: { user },
    });
};

//////////////////////////////////////////////////////////////////////////
// cloud storage

export const uploadImageOnCloud = async (req, res, next) => {
    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    });

    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `users/${user._id}/profilePicture`,
        }
    );

    user.image = { secure_url, public_id };
    await user.save();

    return res.status(200).json({
        success: true,
        data: { user },
    });
};


export const deleteImageOnCloud = async (req, res, next) => {

    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    });

    const results = await cloudinary.uploader.destroy(user.image.public_id);

    if (results.result === "ok") {
        user.image = {
            secure_url: defultImageOnCloud,
            public_id: defultPublicId
        };
    }
    await user.save();

    return res.status(200).json({
        success: true,
        data: { user },
    });
};


