import multer, { diskStorage } from "multer";

export const uploadOnCloud = () => {
    const storage = diskStorage({}); // store in os/temp
    
    const multerUpload = multer({ storage });
    return multerUpload;
}