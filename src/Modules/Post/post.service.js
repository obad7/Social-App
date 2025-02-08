import * as dbService from "../../DB/dbService.js";
import { PostModel } from "../../DB/Models/post.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { encrypt, decrypt } from "../../utils/encryption/encryption.js";
import { hash, compareHash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";

export const createPost = async (req, res, next) => {

    return res.status(200).json({
        success: true,
        message: "Post created successfully",
    });
};