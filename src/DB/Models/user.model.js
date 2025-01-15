import mongoose, { Schema } from "mongoose";
import { rolesType } from "../../Middlewares/auth.middleware.js";
import { genderType } from "../../Middlewares/validation.middleware.js";


const UserModel = mongoose.model("User", userSchema);
export default UserModel;