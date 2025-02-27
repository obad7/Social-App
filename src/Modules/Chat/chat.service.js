import * as dbService from "../../DB/dbService.js";
import { ChatModel } from "../../DB/Models/chat.model.js";
import { roleType } from "../../DB/Models/user.model.js";

// create chat between two users
export const getChat = async (req, res, next) => {

    return res.status(200).json({ success: true });
};