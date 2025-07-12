import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register",upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
router.get("/profile",getUserProfile); 

export default router;
