import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

// spacify file extensions
export const fileValidation = {
    images: ["image/png", "image/jpg", "image/jpeg"],
    files: ["application/pdf"],
    videos: ["video/mp4"],
    audio: ["audio/mpeg"],
};

export const upload = ( fileType, folder ) => {
    const storage = diskStorage({
        destination: (req, file, cb) => {
            const folderPath = path.resolve(".", `${folder}/${req.user._id}`);
            if (fs.existsSync(folderPath)) {
                return cb(null, folderPath);
            } else {
                fs.mkdirSync(folderPath, { recursive: true });
                const filename = `${folder}/${req.user._id}`;
                cb(null, filename);
            }
            
        },

        filename: (req, file, cb) => {
            cb(null,  nanoid() + "_" + file.originalname);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (!fileType.includes(file.mimetype))
            return cb(new Error("File type is not supported"), false);

        return cb(null, true);
    };
    
    const multerUpload = multer({ storage, fileFilter });

    return multerUpload;
}