import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import { uploadToCloudinary } from "../lib/utils.js";

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: 'Please upload files' });
    }

    const { title, artist, albumId, duration } = req.body;

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    }

    return res.status(201).json({ message: 'Song created successfully', song });

  } catch (error) {
    console.error("Error in createSong controller", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = Song.findById(id);

    // if song belongs to an album, remove it from the album
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId,
        { $pull: { songs: song._id } }
      );
    }

    await Song.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error("Error in deleteSong controller", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { tittle, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    return res.status(201).json({ message: 'Album created successfully', album });
  } catch (error) {
    console.log("Error in createAlbum controller", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error("Error in deleteAlbum controller", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  return res.status(200).json({ admin: true });
}