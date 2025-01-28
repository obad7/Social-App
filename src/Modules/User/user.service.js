import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";

export const getProfile = async (req, res, next) => {
    return res.status(200).json({ success: true, user: req.user });
};


export const shareProfile = async (req, res, next) => {
    const { profileId } = req.params;

    let user = undefined;

    if (profileId == req.user._id.toString()) {
        user = req.user;
    } else {
        user = await dbService.findOneAndUpdate({
            model: UserModel,
            filter: { _id: profileId, isDeleted: false },
            data: { 
                $push: { 
                    viewers: {
                        userId: req.user._id,
                        time: Date.now(),
                    },
                },
            },
            select: "userName email image",
        });
    }

    return user 
    ? res.status(200).json({ success: true, data: {user} }) 
    : next(new Error("User not found", { cause: 404 }));
};


