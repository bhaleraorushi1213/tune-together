import {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addRecentlyPlayed, getAllUsers, getLikedSongs, getMessages, getRecentlyPlayed, toggleLikeSong } from "../controller/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.post("/songs/:songId/like", protectRoute, toggleLikeSong);
router.get("/songs/liked", protectRoute, getLikedSongs);
router.post("/recently-played", protectRoute, addRecentlyPlayed);
router.get("/recently-played", protectRoute, getRecentlyPlayed);

export default router;