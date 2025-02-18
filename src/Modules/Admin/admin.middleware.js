import { roleType, UserModel } from '../../DB/Models/user.model.js';
import * as dbService from '../../DB/dbService.js';


export const changeRoleMiddleware = async (req, res, next) => {
    const allRoles = Object.values(roleType);

    // logined user
    const loginedUser = req.user;

    // target user
    const targetUser = await dbService.findById({
        model: UserModel,
        id: { _id: req.body.userId },
    });

    const loginedUserRole = loginedUser.role;
    const targetUserRole = targetUser.role;

    const loginedUserIndex = allRoles.indexOf(loginedUserRole);
    const targetUserIndex = allRoles.indexOf(targetUserRole);

    // check if logined user can modify target user
    const canModify = loginedUserIndex < targetUserIndex;
    if (!canModify) return next(new Error("unauthorized", { cause: 401 }));

    return next();
}