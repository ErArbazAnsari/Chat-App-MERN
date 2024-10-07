import { Router } from "express";
import {
    getUserInfo,
    login,
    removeProfileImage,
    signup,
    updateProfile,
    updateProfileImage,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();

const upload = multer({ dest: "uploads/profiles" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image"),
    updateProfileImage
);
authRoutes.delete("/delete-profile-image", verifyToken, removeProfileImage);

export default authRoutes;
