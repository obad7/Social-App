import * as dbService from "../../../DB/dbService.js";
import { ChatModel } from "../../../DB/Models/chat.model.js";
import { UserModel } from "../../../DB/Models/user.model.js";

export const sendMessage = function (socket, io) {
    return async (content, to) => {
        try {
            const friendId = to;

            const friend = await dbService.findOne({
                model: UserModel,
                filter: { _id: friendId, isDeleted: false },
            });
            if (!friend) throw new Error("Friend not found");

            let chat = await dbService.findOne({
                model: ChatModel,
                filter: { users: { $all: [socket.user._id, friend._id] } },
            })

            // create new chat if not exists
            if (!chat) {
                chat = await dbService.create({
                    model: ChatModel,
                    data: {
                        users: [socket.user._id, friendId],
                        messages: [{ sender: socket.user._id, content }],
                    },
                });
            } else {
                // add message to chat if chat already exist
                chat.messages.push({ sender: socket.user._id, content });
                await chat.save();
            }

            socket.to(friendId).emit("successMessage", { content, from: socket.id });
        } catch (error) {
            console.log(error);
        }
    }
}