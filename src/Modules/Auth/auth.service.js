import userModel from "../../DB/Models/user.model.js";
import { rolesType } from "../../Middlewares/auth.middleware.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { generateToken } from "../../utils/token/token.js";
import { verify } from "../../utils/token/token.js";
import { hash, compare } from "../../utils/hashing/hash.js";
import { encrypt } from "../../utils/encryption/encryption.js";


