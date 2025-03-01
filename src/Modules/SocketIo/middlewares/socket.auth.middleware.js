import { UserModel } from "../../../DB/Models/user.model.js";
import { verifyToken } from "../../../utils/token/token.js";
import * as dbService from "../../../DB/dbService.js";
import { tokenTypes } from "../../../Middlewares/auth.middleware.js";

// decoded token middleware
export const socketAuth = async ({
    socket,
    next = {},
    tokenType = tokenTypes.access,
}) => {
    const { authorization } = socket.handshake.authorization;
    const [bearer, token] = authorization.split(" ") || [];

    if (!bearer || !token) throw new Error("Invalid token", { cause: 401 });

    let ACCESS_SIGTATURE = undefined;
    let REFRESH_SIGTATURE = undefined;

    // get signature based on bearer
    switch (bearer) {
        case "Admin":
            ACCESS_SIGTATURE = process.env.ADMIN_ACCESS_TOKEN;
            REFRESH_SIGTATURE = process.env.ADMIN_REFRESH_TOKEN;
            break;
        case "User":
            ACCESS_SIGTATURE = process.env.USER_ACCESS_TOKEN;
            REFRESH_SIGTATURE = process.env.USER_REFRESH_TOKEN;
            break;
        default:
            break;
    }

    // verify token
    const decoded = verifyToken({
        token: token,
        signature:
            tokenType === tokenTypes.access ? ACCESS_SIGTATURE : REFRESH_SIGTATURE,
    });

    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: decoded.id, isDeleted: false }
    });
    if (!user) throw new Error("User not found", { cause: 401 });

    // check if token is expired
    if (user.changeCredentials?.getTime() >= decoded.iat * 1000)
        throw new Error("Token is expired", { cause: 401 });

    socket.user = user;
    socket.id = user.id;

    return next();
}
