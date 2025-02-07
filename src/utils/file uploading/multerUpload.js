import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

// spacify file extensions
export const fileValidation = {
    images: ["image/png", "image/jpg", "image/jpeg"],
    files: ["application/pdf"],
    videos: ["video/mp4"],
    audio: ["audio/mpeg"],
};

export const upload = ( fileType ) => {
    const storage = diskStorage({
        destination: "uploads",
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