import User from "../models/user.model.js";
import Message from "../models/message.model.js";

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

export const getMessages = async (req, res, next) => {
  try {
    const { userId: myId } = req.auth();
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller", error);
    next(error);
  }
};