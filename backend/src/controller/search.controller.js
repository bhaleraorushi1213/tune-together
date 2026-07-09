import Song from "../models/song.model.js";
import Album from "../models/album.model.js";

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({ songs: [], albums: [] });
    }

    // escape regex special chars so a query like "a+b" doesn't throw
    const safeQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safeQuery, "i");

    const [songs, albums] = await Promise.all([
      Song.find({ $or: [{ title: regex }, { artist: regex }] }).limit(20),
      Album.find({ $or: [{ title: regex }, { artist: regex }] }).limit(10),
    ]);

    res.status(200).json({ songs, albums });
  } catch (error) {
    console.error("Error in search controller", error);
    next(error);
  }
};