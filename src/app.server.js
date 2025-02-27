import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import postRouter from "./Modules/Post/post.controller.js";
import commentRouter from "./Modules/Comment/comment.controller.js";
import adminRouter from "./Modules/Admin/admin.controller.js";
import chatRouter from "./Modules/Chat/chat.controller.js";
import { globalErrorHandler, notFoundHandler } from "./utils/error handling/globalErrorHandler.js";
// graphql
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./Modules/app.graph.js";


const bootstrap = async (app, express) => {
    await connectDB();

    app.use("/graphql", createHandler({ schema: schema }));

    app.use(express.json());
    app.use("/uploads", express.static("uploads"));


    app.use("/admin", adminRouter);
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/post", postRouter);
    app.use("/comment", commentRouter);
    app.use("/chat", chatRouter);

    // 404
    app.all("*", notFoundHandler);

    // global error handler
    app.use(globalErrorHandler);

}

export default bootstrap;