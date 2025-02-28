import * as dbService from "../../DB/dbService.js";
import { ChatModel } from "../../DB/Models/chat.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import mongoose from "mongoose";

// create chat between two users
export const getChat = async (req, res, next) => {
    const { friendId } = req.params;

    const friend = await dbService.findOne({
        model: UserModel,
        filter: { _id: friendId, isDeleted: false },
    });
    if (!friend) return next(new Error("Friend not found", { cause: 404 }));

    const chat = await dbService.findOne({
        model: ChatModel,
        filter: { users: { $all: [req.user._id, friendId] } },
        populate: "users",
    });
    if (!chat) return next(new Error("Chat not found", { cause: 404 }));

    return res.status(200).json({ success: true, data: { chat } });
};


// sent message
export const sendMessage = async (req, res, next) => {
    const { friendId } = req.params;
    const { content } = req.body;

    const friend = await dbService.findOne({
        model: UserModel,
        filter: { _id: friendId, isDeleted: false },
    });
    if (!friend) return next(new Error("Friend not found", { cause: 404 }));

    let chat = await dbService.findOne({
        model: ChatModel,
        filter: { users: { $all: [req.user._id, friend._id] } },
    })

    // create new chat if not exists
    if (!chat) {
        chat = await dbService.create({
            model: ChatModel,
            data: {
                users: [req.user._id, friendId],
                messages: [{ sender: req.user._id, content }],
            },
        });
    } else {
        // add message to chat if chat already exist
        chat.messages.push({ sender: req.user._id, content });
        await chat.save();
    }

    console.log(chat.users); // Check the output
    console.log(typeof chat.users[0]); // Should print "object"
    console.log(chat.users[0] instanceof mongoose.Types.ObjectId); // Should print "true"
    let chatPopulated = await dbService.findOne({
        model: ChatModel,
        filter: { _id: chat._id },
        populate: "users",
    });

    return res.status(200).json({ success: true, data: { chatPopulated } });
};