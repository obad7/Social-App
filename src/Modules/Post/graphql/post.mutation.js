import * as dbService from "../../../DB/dbService.js";
import { authentication } from "../../../Middlewares/graph/graph.auth.middleware.js";
import { roleType } from "../../../DB/Models/user.model.js";
import { PostModel } from "../../../DB/Models/post.model.js";
import { validation } from "../../../Middlewares/graph/graph.validation.middleware.js";
import { likeAndGraph } from "../../../Modules/Post/post.validation.js";

export const likePost = async (parent, args) => {
    const { postId, authorization } = args;

    await validation(likeAndGraph, args)

    const user = await authentication({
        authorization,
        accessRoles: roleType.User
    });

    const post = await dbService.findByIdAndUpdate({
        model: PostModel,
        id: { _id: postId },
        data: { $addToSet: { likes: user._id } },
        options: { new: true },
    });

    return { message: "success", statusCode: 200, data: post };
}