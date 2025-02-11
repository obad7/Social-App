import * as dbService from "../../DB/dbService.js";
import { PostModel } from "../../DB/Models/post.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { encrypt, decrypt } from "../../utils/encryption/encryption.js";
import { hash, compareHash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { nanoid } from "nanoid";

export const createPost = async (req, res, next) => {
    const { content } = req.body;
    const allImages = [];
    let customId;
    if (req.files.length) {
        customId = nanoid(5);
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `posts/${req.user._id}/post/${customId}` }
            );
            allImages.push({ secure_url, public_id });
        }
    }

    const post = await dbService.create({
        model: PostModel,
        data: {
            content,
            images: allImages,
            createdBy: req.user._id,
            customId,
        },
    });

    return res.status(200).json({
        success: true,
        date: { post },
    });
};


export const updatePost = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Post created successfully",
    });
};


export const softDelete = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Post created successfully",
    });
};


export const getPost = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Post created successfully",
    });
};