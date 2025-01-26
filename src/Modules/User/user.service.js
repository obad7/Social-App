import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";

export const getProfile = async (req, res, next) => {
    return res.status(200).json({ success: true, user: req.user });
};



