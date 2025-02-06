import connectDB from "./DB/connection.js";
import authController from "./Modules/Auth/auth.controller.js";
import userController from "./Modules/User/user.controller.js";
import {globalErrorHandler, notFoundHandler} from "./utils/error handling/globalErrorHandler.js";
import cors from "cors";

const bootstrap = async (app, express) => {

    connectDB();

    app.use(express.json());

    app.use("/uploads", express.static("uploads"));
    app.use(cors());

    app.use("/auth", authController);
    app.use("/user", userController);

    // 404
    app.all("*", notFoundHandler);

    // global error handler
    app.use(globalErrorHandler);

}

export default bootstrap;