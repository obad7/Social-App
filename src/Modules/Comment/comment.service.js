import * as dbService from "../../DB/dbService.js";
import { CommentModel } from '../../DB/Models/comment.model.js';
import { PostModel } from '../../DB/Models/post.model.js';
import { roleType } from "../../DB/Models/user.model.js";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";

export const createComment = async (req, res, next) => {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await dbService.findById({ model: PostModel, id: postId });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    // check if image is provided and upload it to cloudinary
    let image;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { folder: `posts/${post.createdBy}/post/${post.customId}/comments` }
        );
        image = { secure_url, public_id };
    }

    const comment = await dbService.create({
        model: CommentModel,
        data: {
            text,
            createdBy: req.user._id,
            postId: post._id,
            image,
        },
    });

    return res.status(200).json({
        success: true,
        date: { comment },
    });
};


export const updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await dbService.findOne({
        model: CommentModel,
        filter: { _id: commentId, isDeleted: false }
    });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }));

    const post = await dbService.findOne({
        model: PostModel,
        filter: { _id: comment.postId, isDeleted: false }
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    // check if the user is authorized to update the comment
    if (comment.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("unauthorized", { cause: 401 }))
    }

    // check if image is provided and upload it to cloudinary
    let image;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { folder: `posts/${post.createdBy}/post/${post.customId}/comments` }
        );
        image = { secure_url, public_id };
        // delete old image
        if (comment.image) {
            await cloudinary.uploader.destroy(comment.image.public_id);
        }
        comment.image = image;
    }

    // update comment text if text is provided
    comment.text = text ? text : comment.text;
    await comment.save();

    return res.status(200).json({
        success: true,
        date: { comment },
    });
};


export const softDeleteComment = async (req, res, next) => {
    const { commentId } = req.params;

    const comment = await dbService.findById({ model: CommentModel, id: commentId });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }));

    const post = await dbService.findOne({
        model: PostModel,
        filter: { _id: comment.postId, isDeleted: false }
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    // check if the user is authorized to delete the comment
    const commentOwner = comment.createdBy.toString() === req.user._id.toString();
    const postOwner = post.createdBy.toString() == req.user._id.toString();
    const admin = req.user.role === roleType.Admin;
    if (!(commentOwner || postOwner || admin)) {
        return next(new Error("unauthorized", { cause: 401 }))
    }

    comment.isDeleted = true;
    comment.deletedBy = req.user._id;
    await comment.save();

    return res.status(200).json({
        success: true,
        date: { comment },
    });
};


export const getAllComments = async (req, res, next) => {
    const { postId } = req.params;
    const post = await dbService.findOne({
        model: PostModel,
        filter: { _id: postId, isDeleted: false }
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    const comments = await dbService.find({
        model: CommentModel,
        filter: { postId, isDeleted: false },
    });

    return res.status(200).json({
        success: true,
        date: { comments },
    });
};


export const like_unlike = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await dbService.findOne({
        model: CommentModel,
        filter: { _id: commentId, isDeleted: false },
    });
    if (!comment) return next(new Error("Comment not found", { cause: 404 }));
    // post
    // check if the user has already liked the post
    const isLiked = comment.likes.find(
        (user) => user.toString() === userId.toString()
    );

    if (!isLiked) {
        comment.likes.push(userId);
    } else {
        comment.likes = comment.likes.filter(
            (user) => user.toString() !== userId.toString()
        );
    }

    await comment.save();
    return res.status(200).json({ success: true, date: { comment } });
};