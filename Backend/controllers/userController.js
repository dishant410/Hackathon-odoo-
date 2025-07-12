import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
<<<<<<< HEAD
import SwapRequest from "../models/swaprequest.model.js";
import Feedback from "../models/feedback.model.js";
import ActivityLog from "../models/activitylog.model.js";
=======
import { uploadOncloudinary } from "../utils/cloudinary.js";
>>>>>>> 072a88a23b51e173151698179d27a9290f194ab3

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let photoUrl = "https://avatar.iran.liara.run/public/boy"; // Default avatar
    if (req.file) {
      const uploadResult = await uploadOncloudinary(req.file.path);
      if (uploadResult) photoUrl = uploadResult.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
<<<<<<< HEAD
      profilePhoto: "https://avatar.iran.liara.run/public/boy",
=======
      profilePhoto: photoUrl,
>>>>>>> 072a88a23b51e173151698179d27a9290f194ab3
      location,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "defaultsecret", {
      expiresIn: "7d",
    });
    res.cookie("token", token)

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
<<<<<<< HEAD

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, location, profilePhoto, skillsOffered, skillsWanted, availability, isPublic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        location,
        profilePhoto,
        skillsOffered,
        skillsWanted,
        availability,
        isPublic
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Users by Skill
export const searchUsersBySkill = async (req, res) => {
  try {
    const { skill } = req.query;

    const users = await User.find({
      $and: [
        { isPublic: true },
        {
          $or: [
            { skillsOffered: { $regex: skill, $options: 'i' } },
            { skillsWanted: { $regex: skill, $options: 'i' } }
          ]
        }
      ]
    }).select('-password');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Public Users
export const getAllPublicUsers = async (req, res) => {
  try {
    const users = await User.find({ isPublic: true }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Ban User
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "user_banned",
      targetUser: userId,
      details: `User ${user.name} was banned by admin`
    });

    res.status(200).json({ message: "User banned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Unban User
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "user_unbanned",
      targetUser: userId,
      details: `User ${user.name} was unbanned by admin`
    });

    res.status(200).json({ message: "User unbanned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

=======
>>>>>>> 072a88a23b51e173151698179d27a9290f194ab3
