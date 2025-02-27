import { validate } from "graphql";
import mongoose, { Schema, model, Types } from "mongoose";

// messageSchema to store messages
const messageSchema = new Schema(
    {
        content: { type: String, required: true },
        sender: { type: Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

const chatSchema = new Schema(
    {
        users: {
            type: [{ type: Types.ObjectId, ref: "User" }],
            validate: {
                validator: (value) => value.length === 2,
                message: "Chat must only have two users",
            }
        },

        message: [messageSchema],
    },
    {
        timestamps: true,
    }
);

export const ChatModel = mongoose.model.Chat || model("Chat", chatSchema);