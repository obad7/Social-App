import * as dbService from "../../DB/dbService.js";
import { CommentModel } from '../../DB/Models/comment.model.js';
import { PostModel } from '../../DB/Models/post.model.js';
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";

export const createComment = async (req, res, next) => {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await dbService.findById({ model: PostModel, id: postId });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    let image;
    // check if image is provided and upload it to cloudinary
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