import { create } from "zustand";
import type { Song } from "../types";
import { useChatStore } from "./useChatStore";
import { axiosInstance } from "../lib/axios";

// fire-and-forget — don't block playback on this succeeding
const recordRecentlyPlayed = (songId: string) => {
	axiosInstance.post("/users/recently-played", { songId }).catch(() => {
		// silently ignore — recently-played history is a nice-to-have,
		// not worth surfacing a toast/error over a failed background write
	});
};

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	isShuffled: boolean;
	repeatMode: "off" | "all" | "one";

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	toggleShuffle: () => void;
	cycleRepeatMode: () => void;
	reorderQueue: (fromIndex: number, toIndex: number) => void;
	removeFromQueue: (index: number) => void;
	playFromQueue: (index: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
	const emitActivity = (message: string) => {
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: message,
			});
		}
	};

	const shuffleSongs = (songs: Song[], fixedSongId?: string, fixedIndex = 0) => {
		const rest = fixedSongId
			? songs.filter((song) => song._id !== fixedSongId)
			: [...songs];
		for (let i = rest.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[rest[i], rest[j]] = [rest[j], rest[i]];
		}
		if (!fixedSongId) return rest;
		const copy = [...rest];
		copy.splice(Math.min(Math.max(fixedIndex, 0), copy.length), 0, songs.find((song) => song._id === fixedSongId)!);
		return copy;
	};

	return {
		currentSong: null,
		isPlaying: false,
		queue: [],
		currentIndex: -1,
		isShuffled: false,
		repeatMode: "off",

		initializeQueue: (songs) => {
			const currentSong = get().currentSong;
			const nextCurrentSong =
				songs.length === 0
					? null
					: currentSong && songs.some((song) => song._id === currentSong._id)
					? currentSong
					: songs[0];
			const nextCurrentIndex =
				songs.length === 0
					? -1
					: nextCurrentSong
						? songs.findIndex((song) => song._id === nextCurrentSong._id)
						: 0;

			set({
				queue: songs,
				currentSong: nextCurrentSong,
				currentIndex: nextCurrentIndex,
			});
		},

		playAlbum: (songs, startIndex = 0) => {
			if (songs.length === 0) return;

			const safeIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
			const song = songs[safeIndex];
			const { isShuffled } = get();

			const nextQueue = isShuffled
				? shuffleSongs(songs, song._id, safeIndex)
				: songs;

			emitActivity(`Playing ${song.title} by ${song.artist}`);

			set({
				queue: nextQueue,
				currentSong: song,
				currentIndex: nextQueue.findIndex((item) => item._id === song._id),
				isPlaying: true,
			});
		},

		setCurrentSong: (song) => {
			if (!song) return;

			emitActivity(`Playing ${song.title} by ${song.artist}`);

			const songIndex = get().queue.findIndex((s) => s._id === song._id);

			set({
				currentSong: song,
				isPlaying: true,
				currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
			});
		},

		togglePlay: () => {
			const togglePlaying = !get().isPlaying;
			const currentSong = get().currentSong || get().queue[0] || null;

			emitActivity(
				togglePlaying && currentSong
					? `Playing ${currentSong.title} by ${currentSong.artist}`
					: "Idle"
			);

			set((state) => ({
				currentSong: state.currentSong || currentSong,
				currentIndex: state.currentIndex === -1 && state.queue.length > 0 ? 0 : state.currentIndex,
				isPlaying: togglePlaying,
			}));
		},

		playNext: () => {
			const { currentIndex, queue, repeatMode } = get();
			if (queue.length === 0) {
				set({ isPlaying: false });
				return;
			}

			if (repeatMode === "one" && currentIndex >= 0) {
				const currentSong = queue[currentIndex];
				emitActivity(`Playing ${currentSong.title} by ${currentSong.artist}`);
				set({ isPlaying: true });
				return;
			}

			const nextIndex = currentIndex < 0 ? 0 : currentIndex + 1;
			if (nextIndex < queue.length) {
				const nextSong = queue[nextIndex];
				emitActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);
				set({ currentSong: nextSong, currentIndex: nextIndex, isPlaying: true });
				return;
			}

			if (repeatMode === "all") {
				const nextSong = queue[0];
				emitActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);
				set({ currentSong: nextSong, currentIndex: 0, isPlaying: true });
				return;
			}

			emitActivity("Idle");
			set({ isPlaying: false });
		},

		playPrevious: () => {
			const { currentIndex, queue, repeatMode } = get();
			if (queue.length === 0) {
				set({ isPlaying: false });
				return;
			}

			if (repeatMode === "one" && currentIndex >= 0) {
				const currentSong = queue[currentIndex];
				emitActivity(`Playing ${currentSong.title} by ${currentSong.artist}`);
				set({ isPlaying: true });
				return;
			}

			const prevIndex = currentIndex <= 0 ? (repeatMode === "all" ? queue.length - 1 : -1) : currentIndex - 1;
			if (prevIndex >= 0) {
				const prevSong = queue[prevIndex];
				emitActivity(`Playing ${prevSong.title} by ${prevSong.artist}`);
				set({ currentSong: prevSong, currentIndex: prevIndex, isPlaying: true });
				return;
			}

			emitActivity("Idle");
			set({ isPlaying: false });
		},

		toggleShuffle: () => {
			const { queue, currentSong, isShuffled } = get();
			if (isShuffled) {
				set({ isShuffled: false });
				return;
			}

			if (!currentSong) {
				set({ isShuffled: true });
				return;
			}

			const rest = queue.filter((s) => s._id !== currentSong._id);
			for (let i = rest.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[rest[i], rest[j]] = [rest[j], rest[i]];
			}

			const currentIdx = queue.findIndex((s) => s._id === currentSong._id);
			const shuffled = [...rest];
			shuffled.splice(currentIdx, 0, currentSong);

			set({ queue: shuffled, currentIndex: currentIdx, isShuffled: true });
		},

		cycleRepeatMode: () => {
			const order: Array<"off" | "all" | "one"> = ["off", "all", "one"];
			const next = order[(order.indexOf(get().repeatMode) + 1) % order.length];
			set({ repeatMode: next });
		},

		reorderQueue: (fromIndex, toIndex) => {
			const { queue, currentIndex } = get();
			if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= queue.length) return;

			const updated = [...queue];
			const [moved] = updated.splice(fromIndex, 1);
			const insertIndex = Math.min(Math.max(toIndex, 0), updated.length);
			updated.splice(insertIndex, 0, moved);

			let newCurrentIndex = currentIndex;
			if (fromIndex === currentIndex) newCurrentIndex = insertIndex;
			else if (fromIndex < currentIndex && insertIndex >= currentIndex) newCurrentIndex -= 1;
			else if (fromIndex > currentIndex && insertIndex <= currentIndex) newCurrentIndex += 1;

			set({ queue: updated, currentIndex: newCurrentIndex });
		},

		removeFromQueue: (index) => {
			const { queue, currentIndex } = get();
			if (index === currentIndex || index < 0 || index >= queue.length) return;

			const updated = queue.filter((_, i) => i !== index);
			const newCurrentIndex = index < currentIndex ? currentIndex - 1 : currentIndex;
			set({ queue: updated, currentIndex: newCurrentIndex });
		},

		playFromQueue: (index) => {
			const { queue } = get();
			const song = queue[index];
			if (!song) return;

			emitActivity(`Playing ${song.title} by ${song.artist}`);
			recordRecentlyPlayed(song._id);
			set({ currentSong: song, currentIndex: index, isPlaying: true });
		},
	};
});
