import express from "express";
import {
    createSwapRequest,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    getUserSwapRequests,
    getAllSwapRequests
} from "../controllers/swapController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Protected routes
router.post("/create", isAuthenticated, createSwapRequest);
router.put("/accept/:requestId", isAuthenticated, acceptSwapRequest);
router.put("/reject/:requestId", isAuthenticated, rejectSwapRequest);
router.put("/cancel/:requestId", isAuthenticated, cancelSwapRequest);
router.get("/my-requests", isAuthenticated, getUserSwapRequests);

// Admin routes
router.get("/all", isAuthenticated, isAdmin, getAllSwapRequests);

export default router; 