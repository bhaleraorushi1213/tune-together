import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const users = await User.find({ clerkId: { $ne: userId } });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers controller", error);
    next(error);
  }
};