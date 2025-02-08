import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import postRouter from "./Modules/Post/post.controller.js";
import { globalErrorHandler, notFoundHandler } from "./utils/error handling/globalErrorHandler.js";
import cors from "cors";

const bootstrap = async (app, express) => {

    connectDB();

    app.use(express.json());

    app.use("/uploads", express.static("uploads"));
    app.use(cors());

    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/post", postRouter);

    // 404
    app.all("*", notFoundHandler);

    // global error handler
    app.use(globalErrorHandler);

}

export default bootstrap;