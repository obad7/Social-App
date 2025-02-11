import * as dbService from "../../DB/dbService.js";
import { PostModel } from "../../DB/Models/post.model.js";
import { roleType } from "../../DB/Models/user.model.js";
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
    const { content } = req.body;
    const { postId } = req.params;

    const post = await dbService.findOne({
        model: PostModel,
        filter: { _id: postId, createdBy: req.user._id },
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    // update post images if images are provided
    const allImages = [];
    if (req.files.length) {
        // create new images
        for (const file of req.files) {
            // delete old images
            for (const file of post.images) {
                await cloudinary.uploader.destroy(file.public_id);
            }
            // upload new images
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `posts/${req.user._id}/post/${post.customId}` }
            );
            allImages.push({ secure_url, public_id });
        }
        post.images = allImages;
    };

    // update post content if content is provided
    post.content = content ? content : post.content;
    await post.save();

    return res.status(200).json({
        success: true,
        date: { post },
    });
};


export const softDelete = async (req, res, next) => {
    const { postId } = req.params;

    const post = await dbService.findById({ model: PostModel, id: postId });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    // check if the user is authorized to delete the post
    if (post.createdBy.toString() === req.user._id.toString() ||
        req.user.role === roleType.Admin
    ) {
        post.isDeleted = true;
        post.deletedBy = req.user._id;
        await post.save();
        return res.status(200).json({ success: true, date: { post } });
    } else {
        return next(new Error("unauthorized", { cause: 403 }));
    }
};


export const restorePost = async (req, res, next) => {
    const { postId } = req.params;

    const post = await dbService.findOneAndUpdate({
        model: PostModel,
        filter: { _id: postId, isDeleted: true, deletedBy: req.user._id },
        data: {
            isDeleted: false,
            $unset: { deletedBy: "" }
        },
        options: { new: true },
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    return res.status(200).json({ success: true, date: { post } });
};