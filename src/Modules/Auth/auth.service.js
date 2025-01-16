import { UserModel } from "../../DB/Models/user.model.js";
import { hash, compare } from "../../utils/hashing/hash.js";

export const register = async (req, res, next) => {
    const { userName, email, password, confirmPassword } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {return next(new Error("User already exists", { cause: 400 }))}
    if (password !== confirmPassword) {return next(new Error("Passwords do not match", { cause: 400 }))}

    const hashedPassword = hash({ plainText: password });

    const newUser = await UserModel.create({ 
        userName, 
        email, 
        password : hashedPassword,
    });

    return res.status(200).json({ 
        success: true,
        message: newUser,
    });
};

export const login = async (req, res, next) => {
    
};

