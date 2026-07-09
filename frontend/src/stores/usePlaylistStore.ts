import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { Playlist, Song } from "../types";
import toast from "react-hot-toast";

interface PlaylistStore {
	playlists: Playlist[];
	selectedPlaylist: Playlist | null;
	likedSongs: Song[];

	isLoading: boolean;
	isPlaylistLoading: boolean;
	isLikedLoading: boolean;
	error: string | null;

	fetchUserPlaylists: () => Promise<void>;
	fetchPlaylistById: (id: string) => Promise<void>;
	createPlaylist: (title: string, description?: string, isPublic?: boolean) => Promise<Playlist | null>;
	addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
	removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
	deletePlaylist: (id: string) => Promise<void>;

	fetchLikedSongs: () => Promise<void>;
	toggleLikeSong: (songId: string) => Promise<void>;
	isSongLiked: (songId: string) => boolean;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
	playlists: [],
	selectedPlaylist: null,
	likedSongs: [],

	isLoading: false,
	isPlaylistLoading: false,
	isLikedLoading: false,
	error: null,

	fetchUserPlaylists: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/playlists");
			set({ playlists: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message ?? error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchPlaylistById: async (id) => {
		set({ isPlaylistLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/playlists/${id}`);
			set({ selectedPlaylist: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message ?? error.message });
		} finally {
			set({ isPlaylistLoading: false });
		}
	},

	createPlaylist: async (title, description = "", isPublic = true) => {
		try {
			const response = await axiosInstance.post("/playlists", {
				title,
				description,
				isPublic,
			});

			set((state) => ({ playlists: [response.data, ...state.playlists] }));
			toast.success("Playlist created");
			return response.data as Playlist;
		} catch (error: any) {
			toast.error("Failed to create playlist: " + (error.response?.data?.message ?? error.message));
			return null;
		}
	},

	addSongToPlaylist: async (playlistId, songId) => {
		try {
			const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });

			set((state) => ({
				playlists: state.playlists.map((p) => (p._id === playlistId ? { ...p, songs: response.data.songs } : p)),
				selectedPlaylist:
					state.selectedPlaylist?._id === playlistId
						? { ...state.selectedPlaylist, songs: response.data.songs }
						: state.selectedPlaylist,
			}));

			toast.success("Added to playlist");
		} catch (error: any) {
			toast.error("Failed to add song: " + (error.response?.data?.message ?? error.message));
		}
	},

	removeSongFromPlaylist: async (playlistId, songId) => {
		// optimistic update — instant UI feedback, rolled back on failure
		const prevSelected = get().selectedPlaylist;
		const prevPlaylists = get().playlists;

		set((state) => ({
			playlists: state.playlists.map((p) =>
				p._id === playlistId ? { ...p, songs: p.songs.filter((s) => s._id !== songId) } : p
			),
			selectedPlaylist:
				state.selectedPlaylist?._id === playlistId
					? { ...state.selectedPlaylist, songs: state.selectedPlaylist.songs.filter((s) => s._id !== songId) }
					: state.selectedPlaylist,
		}));

		try {
			await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
		} catch (error: any) {
			// rollback
			set({ playlists: prevPlaylists, selectedPlaylist: prevSelected });
			toast.error("Failed to remove song: " + (error.response?.data?.message ?? error.message));
		}
	},

	deletePlaylist: async (id) => {
		try {
			await axiosInstance.delete(`/playlists/${id}`);
			set((state) => ({
				playlists: state.playlists.filter((p) => p._id !== id),
				selectedPlaylist: state.selectedPlaylist?._id === id ? null : state.selectedPlaylist,
			}));
			toast.success("Playlist deleted");
		} catch (error: any) {
			toast.error("Failed to delete playlist: " + (error.response?.data?.message ?? error.message));
		}
	},

	fetchLikedSongs: async () => {
		set({ isLikedLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users/songs/liked");
			set({ likedSongs: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message ?? error.message });
		} finally {
			set({ isLikedLoading: false });
		}
	},

	toggleLikeSong: async (songId) => {
		// optimistic toggle
		const wasLiked = get().isSongLiked(songId);
		const prevLiked = get().likedSongs;

		if (wasLiked) {
			set({ likedSongs: prevLiked.filter((s) => s._id !== songId) });
		}
		// Note: on "like" we don't have the full Song object without a fetch,
		// so we optimistically skip adding it here and just re-fetch on success.

		try {
			const response = await axiosInstance.post(`/users/songs/${songId}/like`);
			if (response.data.liked && !wasLiked) {
				await get().fetchLikedSongs();
			}
		} catch (error: any) {
			set({ likedSongs: prevLiked }); // rollback
			toast.error("Failed to update liked songs: " + (error.response?.data?.message ?? error.message));
		}
	},

	isSongLiked: (songId) => {
		return get().likedSongs.some((s) => s._id === songId);
	},
}));