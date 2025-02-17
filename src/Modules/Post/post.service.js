import * as dbService from "../../DB/dbService.js";
import { PostModel } from "../../DB/Models/post.model.js";
import { CommentModel } from '../../DB/Models/comment.model.js';
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


export const getSinglePost = async (req, res, next) => {
    const { postId } = req.params;

    const post = await dbService.findOne({
        model: PostModel,
        filter: { _id: postId, isDeleted: false },
        populate: [
            // multiple populate on the post
            { path: "createdBy", select: "userName image -_id" },
            {
                path: "comments", select: "text image -_id",
                // nested populate on the comments
                populate: { path: "createdBy", select: "userName image -_id" }
            }
        ]
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    return res.status(200).json({ success: true, date: { post } });
}


export const activePosts = async (req, res, next) => {

    // 1
    // if (req.user.role === roleType.Admin) {
    //     posts = await dbService.find({
    //         model: PostModel,
    //         filter: { isDeleted: false },
    //         populate: { path: "createdBy", select: "userName image -_id" }
    //     });
    // } else {
    //     posts = await dbService.find({
    //         model: PostModel,
    //         filter: { isDeleted: false, createdBy: req.user._id },
    //         populate: { path: "createdBy", select: "userName image -_id" }
    //     });
    // }

    // 2
    // posts = await dbService.find({
    //     model: PostModel,
    //     filter: { isDeleted: false },
    //     populate: { path: "createdBy", select: "userName image -_id" }
    // });

    // // add comments to each post
    // let results = [];
    // for (const post of posts) {
    //     const comments = await dbService.find({
    //         model: CommentModel,
    //         filter: { postId: post._id, isDeleted: false },
    //         select: "text image -_id"
    //     });
    //     results.push({ post, comments });
    // }

    const cursor = await PostModel.find({ isDeleted: false }).cursor();
    let results = [];
    for (
        let post = await cursor.next();
        post != null;
        post = await cursor.next()
    ) {
        const comments = await dbService.find({
            model: CommentModel,
            filter: { postId: post._id, isDeleted: false },
            select: "text image -_id"
        });
        results.push({ post, comments });
    }
    return res.status(200).json({ success: true, date: { results } });
};


export const freezedPosts = async (req, res, next) => {
    // let posts;

    // if (req.user.role === roleType.Admin) {
    //     posts = await dbService.find({
    //         model: PostModel,
    //         filter: { isDeleted: true },
    //         populate: { path: "createdBy", select: "userName image -_id" }
    //     });
    // } else {
    //     posts = await dbService.find({
    //         model: PostModel,
    //         filter: { isDeleted: true, createdBy: req.user._id },
    //         populate: { path: "createdBy", select: "userName image -_id" }
    //     });
    // }
    // return res.status(200).json({ success: true, date: { posts } });

    const cursor = await PostModel.find({ isDeleted: true }).cursor();
    let results = [];
    for (
        let post = await cursor.next();
        post != null;
        post = await cursor.next()
    ) {
        const comments = await dbService.find({
            model: CommentModel,
            filter: { postId: post._id, isDeleted: false },
            select: "text image -_id"
        });
        results.push({ post, comments });
    }
    return res.status(200).json({ success: true, date: { results } });
};


export const like_unlike = async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await dbService.findOne({
        model: PostModel,
        filter: { _id: postId, isDeleted: false },
    });
    if (!post) return next(new Error("Post not found", { cause: 404 }));

    // check if the user has already liked the post
    const isLiked = post.likes.find(
        (user) => user.toString() === userId.toString()
    );

    if (!isLiked) {
        post.likes.push(userId);
    } else {
        post.likes = post.likes.filter(
            (user) => user.toString() !== userId.toString()
        );
    }

    await post.save();

    const populatedUser = await dbService.findOne({
        model: PostModel,
        filter: { _id: postId, isDeleted: false },
        populate: {
            path: "likes",
            select: "userName image -_id",
        }
    })
    return res.status(200).json({ success: true, date: { populatedUser } });
};