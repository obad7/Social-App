import { UserModel } from "../DB/Models/user.model.js";
import { asyncHandler } from "../utils/error handling/asyncHandler.js";
import { verifyToken } from "../utils/token/token.js";
import * as dbService from "../DB/dbService.js";

// token types
export const tokenTypes = {
    access: "access",
    refresh: "refresh",
};

// decoded token middleware
export const decodedToken = async ({
    authorization = "",
    tokenType = tokenTypes.access,
    next = {},
}) => {
    const [bearer, token] = authorization.split(" ") || [];

    if (!bearer || !token)
        return next(new Error("Invalid token", { cause: 401 }));

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
    if (!user) return next(new Error("User not found", { cause: 400 }));

    // check if token is expired
    if (user.changeCredentials?.getTime() >= decoded.iat * 1000)
        return next(new Error("Token expired", { cause: 401 }));

    return user;
}

// authentication middleware
export const authentication = () => {
    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;
        req.user = await decodedToken({
            authorization: authorization,
            next: next,
        });
        return next();
    });
}

// authorization middleware
export const allowTo = (roles = []) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new Error("You are not allowed to perform this action", { cause: 403 }));
        return next();
    })
}