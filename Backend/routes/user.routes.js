import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    searchUsersBySkill,
    getAllPublicUsers,
    getAllUsers,
    banUser,
    unbanUser
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", searchUsersBySkill);
router.get("/public", getAllPublicUsers);

// Protected routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);

// Admin routes
router.get("/all", isAuthenticated, isAdmin, getAllUsers);
router.put("/ban/:userId", isAuthenticated, isAdmin, banUser);
router.put("/unban/:userId", isAuthenticated, isAdmin, unbanUser);

export default router;
