import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import type { Album, Song, Stats } from "../types/index.ts";
import toast from "react-hot-toast";

interface MusicStore {
	albums: Album[];
	songs: Song[];
	isLoading: boolean;
	isAlbumLoading: boolean;
	isFeaturedLoading: boolean;
	isMadeForYouLoading: boolean;
	isTrendingLoading: boolean;
	isSongsLoading: boolean;
	isStatsLoading: boolean;
	error: string | null;
	selectedAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	selectedAlbum: null,
	isLoading: false,
	isAlbumLoading: false,
	isFeaturedLoading: false,
	isMadeForYouLoading: false,
	isTrendingLoading: false,
	isSongsLoading: false,
	isStatsLoading: false,
	error: null,
	featuredSongs: [],
	madeForYouSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	fetchSongs: async () => {
		set({ isSongsLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isSongsLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isStatsLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isStatsLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isAlbumLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ selectedAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isAlbumLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isFeaturedLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/featured`);
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFeaturedLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isMadeForYouLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/made-for-you`);
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isMadeForYouLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isTrendingLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/trending`);
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isTrendingLoading: false });
		}
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);
			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));

			toast.success("Song deleted successfully");
		} catch (error: any) {
			set({ error: error.response.data.message });
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) => 
					song.albumId  === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				)
			}));

			toast.success("Album deleted successfully");
		} catch (error: any) {
			set({ error: error.response.data.message });
			toast.error("Error deleting album");
		} finally {
			set({ isLoading: false });
		}
	}
}));
