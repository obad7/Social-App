import * as dbService from "../../DB/dbService.js";
import { defultImage, UserModel } from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { encrypt, decrypt } from "../../utils/encryption/encryption.js";
import { hash, compareHash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";

export const getProfile = async (req, res, next) => {

    // if (req.user.phone) {
    //     const decoded = decrypt({
    //         encrypted: req.user.phone,
    //         signature: process.env.ENCRYPTION_KEY,
    //     });
    //     console.log("decoded:",decoded);
    //     req.user.phone = decoded;
    // }
    // console.log("req.user.phone",req.user.phone);

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
    ? res.status(200).json({ success: true, data: {user} }) 
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
    const { oldCode, newCode} = req.body;

    if (
        !compareHash({ plainText: oldCode, hash: req.user.confirmEmailOTP }) ||
        !compareHash({ plainText: newCode, hash: req.user.tampEmailOTP })
    )
        return next(new Error("Invalid code", { cause: 400 }));

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
    if(req.body.phone) {
        req.body.phone = encrypt({ 
            plainText : req.body.phone,
            signature: process.env.ENCRYPTION_KEY,
        });
    }

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        data: {...req.body},
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


export const deleteprofilePicture = async (req, res, next) => { 
    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id},
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
