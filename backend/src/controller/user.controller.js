import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Song from "../models/song.model.js";

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

export const toggleLikeSong = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const { songId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const alreadyLiked = user.likedSongs.some((id) => id.toString() === songId);

    if (alreadyLiked) {
      user.likedSongs.pull(songId);
    } else {
      user.likedSongs.push(songId);
    }
    await user.save();

    res.status(200).json({ liked: !alreadyLiked });
  } catch (error) {
    next(error);
  }
};

export const getLikedSongs = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await User.findOne({ clerkId: userId }).populate("likedSongs");
    res.status(200).json(user?.likedSongs || []);
  } catch (error) {
    next(error);
  }
};

export const addRecentlyPlayed = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const { songId } = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // dedupe: drop any existing entry for this song before re-adding at the front,
    // so replaying a song moves it to the top instead of listing it twice
    user.recentlyPlayed = user.recentlyPlayed.filter((entry) => entry.song.toString() !== songId);
    user.recentlyPlayed.unshift({ song: songId, playedAt: new Date() });
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 50); // cap history length

    await user.save();
    res.status(200).json({ message: "Recorded" });
  } catch (error) {
    next(error);
  }
};

export const getRecentlyPlayed = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await User.findOne({ clerkId: userId }).populate("recentlyPlayed.song");

    if (!user) return res.status(404).json({ message: "User not found" });

    // filter out entries where the song was deleted since being played
    // (populate leaves `song: null` for a dangling ref instead of throwing)
    const history = user.recentlyPlayed.filter((entry) => entry.song !== null);

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};