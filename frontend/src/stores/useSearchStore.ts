import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { Song, Album } from "../types";

interface SearchStore {
	query: string;
	songResults: Song[];
	albumResults: Album[];
	isSearching: boolean;
	error: string | null;

	setQuery: (query: string) => void;
	search: (query: string) => Promise<void>;
	clearResults: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
	query: "",
	songResults: [],
	albumResults: [],
	isSearching: false,
	error: null,

	setQuery: (query) => set({ query }),

	search: async (query) => {
		if (!query.trim()) {
			set({ songResults: [], albumResults: [], isSearching: false });
			return;
		}

		set({ isSearching: true, error: null });
		try {
			const response = await axiosInstance.get("/search", { params: { q: query } });
			set({ songResults: response.data.songs, albumResults: response.data.albums });
		} catch (error: any) {
			set({ error: error.response?.data?.message ?? error.message });
		} finally {
			set({ isSearching: false });
		}
	},

	clearResults: () => set({ query: "", songResults: [], albumResults: [] }),
}));