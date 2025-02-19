import { Router } from "express";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userValidation from "./user.validation.js"
import { validation } from "../../Middlewares/validation.middleware.js";
import { fileValidation, upload } from "../../utils/file uploading/multerUpload.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();

// get profile
router.post(
    "/profile",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(userService.getProfile)
);

// share profile
router.get(
    "/profile/:profileId",
    validation(userValidation.shareProfileSchema),
    authentication(),
    asyncHandler(userService.shareProfile)
)

// update profile email
router.patch(
    "/profile/email",
    validation(userValidation.updateEmailSchema),
    authentication(),
    asyncHandler(userService.updateEmail)
);

// reset email 
router.patch(
    "/profile/resetEmail",
    validation(userValidation.resetEmailSchema),
    authentication(),
    asyncHandler(userService.resetEmail)
);

// update profile
router.patch(
    "/profile/updateProfile",
    validation(userValidation.updateProfileSchema),
    authentication(),
    asyncHandler(userService.updateProfile)
);

// update password
router.patch(
    "/updatePassword",
    validation(userValidation.updatePasswordSchema),
    authentication(),
    asyncHandler(userService.updatePassword)
);

//////////////////////////////////////////////////////////////////////////
// upload on Disk Storage

router.post(
    "/profilePicture",
    authentication(),
    upload(fileValidation.images, "uploads/user").single("image"),
    asyncHandler(userService.uploadImageOnDisk)
);

// upload multiple images
router.post(
    "/multipleImages",
    authentication(),
    upload(fileValidation.images, "uploads/user").array("image"),
    asyncHandler(userService.uploadMultipleImagesOnDisk)
);

// delete profile picture
router.delete(
    "/deleteProfilePicture",
    authentication(),
    upload(fileValidation.images, "uploads/user").single("image"),
    asyncHandler(userService.deleteProfilePicture)
);

//////////////////////////////////////////////////////////////////////////
// upload on Cloud Storage

router.post(
    "/uploadPictureOnCloud",
    authentication(),
    uploadOnCloud().single("image"),
    asyncHandler(userService.uploadImageOnCloud)
);

// upload delete profile picture
router.delete(
    "/deleteImageOnCloud",
    authentication(),
    uploadOnCloud().single("image"),
    asyncHandler(userService.deleteImageOnCloud)
);

export default router;