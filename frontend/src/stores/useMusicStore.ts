import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import type { Album, Song } from "../types/index.ts";

interface MusicStore {
	albums: Album[];
	songs: Song[];
	isLoading: boolean;
	isAlbumLoading: boolean;
	isFeaturedLoading: boolean;
	isMadeForYouLoading: boolean;
	isTrendingLoading: boolean;
	error: string | null;
	selectedAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
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
	error: null,
	featuredSongs: [],
	madeForYouSongs: [],
	trendingSongs: [],

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
}));
