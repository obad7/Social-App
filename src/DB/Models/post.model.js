import mongoose, { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
    {
        content: {
            type: String,
            minLength: 2,
            maxLength: 5000,
            trim: true,
            required: function () {
                return this.images?.length ? false : true;
            }
        },

        images: [{
            secure_url: String,
            public_id: String
        }],

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],

        isDeleted: {
            type: Boolean,
            default: false
        },

        customId: {
            type: String,
            unique: true,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // include virtuals in response json
        toObject: { virtuals: true } // include virtuals in object
    }
);

postSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "postId",
    localField: "_id",
});

export const PostModel = mongoose.model.Post || model("Post", postSchema);