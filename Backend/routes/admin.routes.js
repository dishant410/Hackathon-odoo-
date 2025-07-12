import express from "express";
import {
    getActivityLogs,
    getPlatformStats,
    getUserActivityReport,
    sendPlatformMessage,
    getRecentActivity
} from "../controllers/adminController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/activity-logs", getActivityLogs);
router.get("/stats", getPlatformStats);
router.get("/user-report/:userId", getUserActivityReport);
router.post("/send-message", sendPlatformMessage);
router.get("/recent-activity", getRecentActivity);

export default router; 