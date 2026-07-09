import Playlist from "../models/playlist.model.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const { title, description, isPublic } = req.body;

    const playlist = await Playlist.create({
      title,
      description,
      isPublic,
      owner: userId,
      // fallback cover, first song's art will override this client-side later
      imageUrl: "https://placehold.co/400x400/1a1a1a/fff?text=Playlist",
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getUserPlaylists = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const playlists = await Playlist.find({ owner: userId }).sort({ updatedAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs");
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      id,
      { $addToSet: { songs: songId } }, // addToSet avoids duplicates
      { new: true }
    );

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const playlist = await Playlist.findByIdAndUpdate(
      id,
      { $pull: { songs: songId } },
      { new: true }
    );
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ message: "Not your playlist" });
    }

    await playlist.deleteOne();
    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    next(error);
  }
};