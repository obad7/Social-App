import UserModel from "../DB/Models/user.model.js";
import { verify } from "../utils/token/token.js";

export const rolesType = {
    User : "User",
    Admin : "Admin"
}

export const authentication = async (req, res, next) => {
    try {
        // get token from headers
        const { authorization } = req.headers;
        if (!authorization) return next(new Error("Authorization token is required", { cause: 401 }));
        
        const [ Bearer, token] = authorization.split(" ");
        let TOKEN_SIGNITURE = undefined;

        switch (Bearer) {
            case "Bearer":
                TOKEN_SIGNITURE = process.env.JWT_SECRET_USER;
                break;
            case "Admin":
                TOKEN_SIGNITURE = process.env.JWT_SECRET_ADMIN;
                break;
            default:
                break;
        }

        const decoded = verify({ token: token, signature: TOKEN_SIGNITURE});
        if (!decoded?.id) return next(new Error("Invalid token", { cause: 401 }));

        const user = await UserModel.findById(decoded.id);
        if (!user) return next(new Error("User does not exist", { cause: 404 }));

        // attach user to the request object
        req.user = user;

        return next();
    } catch (error) {
        return next(error);
    }
};
