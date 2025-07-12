import ActivityLog from "../models/activitylog.model.js";
import User from "../models/user.model.js";
import SwapRequest from "../models/swaprequest.model.js";
import Feedback from "../models/feedback.model.js";

// Get Activity Logs
export const getActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action } = req.query;

        let query = {};
        if (action) {
            query.action = action;
        }

        const logs = await ActivityLog.find(query)
            .populate('user', 'name email')
            .populate('targetUser', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ActivityLog.countDocuments(query);

        res.status(200).json({
            logs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Platform Statistics
export const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isBanned: { $ne: true } });
        const bannedUsers = await User.countDocuments({ isBanned: true });

        const totalSwaps = await SwapRequest.countDocuments();
        const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
        const acceptedSwaps = await SwapRequest.countDocuments({ status: 'accepted' });
        const rejectedSwaps = await SwapRequest.countDocuments({ status: 'rejected' });

        const totalFeedback = await Feedback.countDocuments();
        const avgRating = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                banned: bannedUsers
            },
            swaps: {
                total: totalSwaps,
                pending: pendingSwaps,
                accepted: acceptedSwaps,
                rejected: rejectedSwaps
            },
            feedback: {
                total: totalFeedback,
                averageRating: avgRating[0]?.avgRating || 0
            }
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get User Activity Report
export const getUserActivityReport = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const sentSwaps = await SwapRequest.find({ fromUser: userId });
        const receivedSwaps = await SwapRequest.find({ toUser: userId });
        const feedback = await Feedback.find({ toUser: userId });
        const activityLogs = await ActivityLog.find({ user: userId });

        const report = {
            user: {
                name: user.name,
                email: user.email,
                joinedAt: user.createdAt,
                isBanned: user.isBanned
            },
            swaps: {
                sent: sentSwaps.length,
                received: receivedSwaps.length,
                accepted: receivedSwaps.filter(s => s.status === 'accepted').length,
                rejected: receivedSwaps.filter(s => s.status === 'rejected').length
            },
            feedback: {
                received: feedback.length,
                averageRating: feedback.length > 0
                    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
                    : 0
            },
            activity: activityLogs.length
        };

        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Send Platform Message (placeholder for future implementation)
export const sendPlatformMessage = async (req, res) => {
    try {
        const { message, type } = req.body;

        // This would typically integrate with a notification system
        // For now, we'll just log it as an activity
        await ActivityLog.create({
            user: req.user.id,
            action: "platform_message_sent",
            details: `Platform message sent: ${message} (Type: ${type})`
        });

        res.status(200).json({ message: "Platform message sent successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Recent Activity
export const getRecentActivity = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const recentActivity = await ActivityLog.find({})
            .populate('user', 'name email')
            .populate('targetUser', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json(recentActivity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 