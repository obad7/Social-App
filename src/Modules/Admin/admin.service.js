import { UserModel } from "../../DB/Models/user.model.js";
import { PostModel } from "../../DB/Models/post.model.js";
import * as dbService from "../../DB/dbService.js";

export const getAllPostsAndUsers = async (req, res, next) => {

    const results = await Promise.all([
        PostModel.find({}),
        UserModel.find({})
    ]);
    if (!results) return next(new Error("Something went wrong", { cause: 500 }));

    return res.status(200).json({ success: true, date: { results } });
}


export const changeRole = async (req, res, next) => {
    const { userId, role } = req.body;

    const user = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { _id: userId },
        data: { role },
        options: { new: true }
    });
    if (!user) return next(new Error("User not found", { cause: 404 }));

    return res.status(200).json({ success: true, date: { user } });
}