import { Router } from "express";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userValidation from "./user.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";
import { fileValidation, upload } from "../../utils/file uploading/multerUpload.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();

router.post(
    "/profile",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(userService.getProfile)
);

router.get(
    "/profile/:profileId",
    validation(userValidation.shareProfileSchema),
    authentication(),
    asyncHandler(userService.shareProfile)
)

router.patch(
    "/profile/email",
    validation(userValidation.updateEmailSchema),
    authentication(),
    asyncHandler(userService.updateEmail)
);

router.patch(
    "/profile/resetEmail",
    validation(userValidation.resetEmailSchema),
    authentication(),
    asyncHandler(userService.resetEmail)
);

router.patch(
    "/profile/updateProfile",
    validation(userValidation.updateProfileSchema),
    authentication(),
    asyncHandler(userService.updateProfile)
);

router.patch(
    "/updatePassword",
    validation(userValidation.updatePasswordSchema),
    authentication(),
    asyncHandler(userService.updatePassword)
);

// Disk Storage

router.post(
    "/profilePicture",
    authentication(),
    upload(fileValidation.images, "uploads/user").single("image"),
    asyncHandler(userService.uploadImageOnDisk)
);

router.post(
    "/multipleImages",
    authentication(),
    upload(fileValidation.images, "uploads/user").array("image"),
    asyncHandler(userService.uploadMultipleImagesOnDisk)
);

router.delete(
    "/deleteProfilePicture",
    authentication(),
    upload(fileValidation.images, "uploads/user").single("image"),
    asyncHandler(userService.deleteProfilePicture)
);

// Cloud Storage

router.post(
    "/uploadPictureOnCloud",
    authentication(),
    uploadOnCloud().single("image"),
    asyncHandler(userService.uploadImageOnCloud)
);

router.delete(
    "/deleteImageOnCloud",
    authentication(),
    uploadOnCloud().single("image"),
    asyncHandler(userService.deleteImageOnCloud)
);

export default router;