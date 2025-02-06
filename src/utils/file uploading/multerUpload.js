import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export const upload = () => {
    const storage = diskStorage({
        destination: "uploads",
        filename: (req, file, cb) => {
            cb(null,  nanoid() + "_" + file.originalname);

            
        },
    });
    
    const multerUpload = multer({ storage });

    return multerUpload; //object
}