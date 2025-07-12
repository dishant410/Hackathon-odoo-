import SwapRequest from "../models/swaprequest.model.js";
import User from "../models/user.model.js";
import ActivityLog from "../models/activitylog.model.js";

// Create Swap Request
export const createSwapRequest = async (req, res) => {
    try {
        const { toUserId, skillOffered, skillWanted } = req.body;

        // Check if user exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is banned
        if (toUser.isBanned) {
            return res.status(400).json({ message: "Cannot send request to banned user" });
        }

        // Check if request already exists
        const existingRequest = await SwapRequest.findOne({
            fromUser: req.user.id,
            toUser: toUserId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Swap request already exists" });
        }

        const swapRequest = await SwapRequest.create({
            fromUser: req.user.id,
            toUser: toUserId,
            skillOffered,
            skillWanted
        });

        // Log the action
        await ActivityLog.create({
            user: req.user.id,
            action: "swap_created",
            targetUser: toUserId,
            details: `Swap request created for ${skillOffered} in exchange for ${skillWanted}`
        });

        res.status(201).json(swapRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Accept Swap Request
export const acceptSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const swapRequest = await SwapRequest.findById(requestId);
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        // Check if the user is the recipient of the request
        if (swapRequest.toUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to accept this request" });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({ message: "Request is not pending" });
        }

        swapRequest.status = "accepted";
        await swapRequest.save();

        // Log the action
        await ActivityLog.create({
            user: req.user.id,
            action: "swap_accepted",
            targetUser: swapRequest.fromUser,
            details: `Swap request accepted for ${swapRequest.skillOffered} in exchange for ${swapRequest.skillWanted}`
        });

        res.status(200).json(swapRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Reject Swap Request
export const rejectSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const swapRequest = await SwapRequest.findById(requestId);
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        // Check if the user is the recipient of the request
        if (swapRequest.toUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to reject this request" });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({ message: "Request is not pending" });
        }

        swapRequest.status = "rejected";
        await swapRequest.save();

        // Log the action
        await ActivityLog.create({
            user: req.user.id,
            action: "swap_rejected",
            targetUser: swapRequest.fromUser,
            details: `Swap request rejected for ${swapRequest.skillOffered} in exchange for ${swapRequest.skillWanted}`
        });

        res.status(200).json(swapRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cancel Swap Request (by sender)
export const cancelSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const swapRequest = await SwapRequest.findById(requestId);
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        // Check if the user is the sender of the request
        if (swapRequest.fromUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to cancel this request" });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({ message: "Request is not pending" });
        }

        swapRequest.status = "cancelled";
        await swapRequest.save();

        // Log the action
        await ActivityLog.create({
            user: req.user.id,
            action: "swap_cancelled",
            targetUser: swapRequest.toUser,
            details: `Swap request cancelled for ${swapRequest.skillOffered} in exchange for ${swapRequest.skillWanted}`
        });

        res.status(200).json(swapRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get User's Swap Requests (sent and received)
export const getUserSwapRequests = async (req, res) => {
    try {
        const sentRequests = await SwapRequest.find({ fromUser: req.user.id })
            .populate('toUser', 'name profilePhoto')
            .sort({ createdAt: -1 });

        const receivedRequests = await SwapRequest.find({ toUser: req.user.id })
            .populate('fromUser', 'name profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json({
            sent: sentRequests,
            received: receivedRequests
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get All Swap Requests
export const getAllSwapRequests = async (req, res) => {
    try {
        const swapRequests = await SwapRequest.find({})
            .populate('fromUser', 'name email')
            .populate('toUser', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(swapRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 