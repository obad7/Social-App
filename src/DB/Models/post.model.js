import mongoose, { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
    {
        content: {
            type: String,
            minLength: 3,
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

        deleted: {
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
    { timestamps: true }
);

export const PostModel = mongoose.model.Post || model("Post", postSchema);