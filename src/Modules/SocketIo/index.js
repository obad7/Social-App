import { Server } from "socket.io";
import * as chatService from "./chatting/chat.service.js";
import { socketAuth } from "./middlewares/socket.auth.middleware.js";

export const runSoket = function (server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    })

    io.use(socketAuth);

    io.on("connection", function (socket) {
        console.log("a user connected", socket.id);
        socket.on("sendMessage", chatService.sendMessage(socket, io));
    });

};