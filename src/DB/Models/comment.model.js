import mongoose, { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
    {
        text: {
            type: String,
            minLength: [2, "Comment must be at least 3 characters long"],
            maxLength: [5000, "Comment must be at most 5000 characters long"],
            trim: true,
            required: function () {
                return this.image?.length ? false : true;
            }
        },

        image: {
            secure_url: String,
            public_id: String
        },

        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },

        postId: {
            type: Types.ObjectId,
            ref: "Post",
            required: true
        },

        deletedBy: {
            type: Types.ObjectId,
            ref: "User",
        },

        likes: [{
            type: Types.ObjectId,
            ref: "User",
        }],

        isDeleted: {
            type: Boolean,
            default: false
        },

        perantComment: {
            type: Types.ObjectId,
            ref: "Comment",
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "perantComment",
});

export const CommentModel = mongoose.model.Comment || model("Comment", commentSchema);