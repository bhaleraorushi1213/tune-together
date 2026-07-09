// backend/src/route/playlist.route.js
import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.get("/", protectRoute, getUserPlaylists);
router.get("/:id", getPlaylistById); // public view, no protectRoute
router.post("/", protectRoute, createPlaylist);
router.post("/:id/songs", protectRoute, addSongToPlaylist);
router.delete("/:id/songs/:songId", protectRoute, removeSongFromPlaylist);
router.delete("/:id", protectRoute, deletePlaylist);

export default router;