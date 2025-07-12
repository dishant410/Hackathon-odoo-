import Feedback from "../models/feedback.model.js";
import SwapRequest from "../models/swaprequest.model.js";
import User from "../models/user.model.js";

// Create Feedback
export const createFeedback = async (req, res) => {
    try {
        const { swapId, rating, comment } = req.body;

        // Check if swap request exists and is accepted
        const swapRequest = await SwapRequest.findById(swapId);
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        if (swapRequest.status !== "accepted") {
            return res.status(400).json({ message: "Can only leave feedback for accepted swaps" });
        }

        // Check if user is part of the swap
        if (swapRequest.fromUser.toString() !== req.user.id && swapRequest.toUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to leave feedback for this swap" });
        }

        // Determine the other user in the swap
        const toUserId = swapRequest.fromUser.toString() === req.user.id ? swapRequest.toUser : swapRequest.fromUser;

        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({
            swapId,
            fromUser: req.user.id
        });

        if (existingFeedback) {
            return res.status(400).json({ message: "Feedback already exists for this swap" });
        }

        const feedback = await Feedback.create({
            swapId,
            fromUser: req.user.id,
            toUser: toUserId,
            rating,
            comment
        });

        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get User's Feedback
export const getUserFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ toUser: req.user.id })
            .populate('fromUser', 'name profilePhoto')
            .populate('swapId', 'skillOffered skillWanted')
            .sort({ createdAt: -1 });

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Feedback for a Specific User
export const getFeedbackForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const feedback = await Feedback.find({ toUser: userId })
            .populate('fromUser', 'name profilePhoto')
            .populate('swapId', 'skillOffered skillWanted')
            .sort({ createdAt: -1 });

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { rating, comment } = req.body;

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        // Check if user is the author of the feedback
        if (feedback.fromUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this feedback" });
        }

        feedback.rating = rating;
        feedback.comment = comment;
        await feedback.save();

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        // Check if user is the author of the feedback
        if (feedback.fromUser.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this feedback" });
        }

        await Feedback.findByIdAndDelete(feedbackId);

        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get All Feedback
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({})
            .populate('fromUser', 'name email')
            .populate('toUser', 'name email')
            .populate('swapId', 'skillOffered skillWanted')
            .sort({ createdAt: -1 });

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 