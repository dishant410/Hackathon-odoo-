import express from "express";
import {
    createFeedback,
    getUserFeedback,
    getFeedbackForUser,
    updateFeedback,
    deleteFeedback,
    getAllFeedback
} from "../controllers/feedbackController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Protected routes
router.post("/create", isAuthenticated, createFeedback);
router.get("/my-feedback", isAuthenticated, getUserFeedback);
router.get("/user/:userId", getFeedbackForUser);
router.put("/update/:feedbackId", isAuthenticated, updateFeedback);
router.delete("/delete/:feedbackId", isAuthenticated, deleteFeedback);

// Admin routes
router.get("/all", isAuthenticated, isAdmin, getAllFeedback);

export default router; 