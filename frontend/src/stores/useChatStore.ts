import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import type { Message, User } from "../types";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	isUsersLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;
	unreadCounts: Record<string, number>;
	totalUnread: number;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
	autoConnect: false, // only connects if user is authenticated
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	messages: [],
	selectedUser: null,
	unreadCounts: {},
	totalUnread: 0,
	error: null,
	socket: socket,
	onlineUsers: new Set(),
	userActivities: new Map(),
	isUsersLoading: false,
	isLoading: false,
	isConnected: false,

	setSelectedUser: (user) => {
		set((state) => {
			if (!user) return { selectedUser: null };
			const nextUnread = { ...state.unreadCounts };
			const prevCount = nextUnread[user.clerkId] || 0;
			if (prevCount > 0) delete nextUnread[user.clerkId];
			const nextTotal = Math.max(0, (state.totalUnread || 0) - prevCount);
			return { selectedUser: user, unreadCounts: nextUnread, totalUnread: nextTotal };
		});
	},

	fetchUsers: async () => {
		set({ isUsersLoading: true, error: null });

		try {
			const reponse = await axiosInstance.get("/users");
			set({ users: reponse.data });
		} catch (error: any) {
			set({ error: error?.response?.data?.message ?? "Failed to fetch users" });
		} finally {
			set({ isUsersLoading: false });
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();
			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => {
					const nextMessages = [...state.messages, message];
					const currentUserId = (socket as any).auth?.userId;
					let nextUnread = { ...state.unreadCounts };
					let nextTotal = state.totalUnread || 0;
					// if this client is the receiver and the conversation with sender isn't open, increment unread
					if (message.receiverId === currentUserId) {
						const sender = message.senderId;
						if (!state.selectedUser || state.selectedUser.clerkId !== sender) {
							nextUnread = { ...nextUnread, [sender]: (nextUnread[sender] || 0) + 1 };
							nextTotal += 1;
						}
					}
					return { messages: nextMessages, unreadCounts: nextUnread, totalUnread: nextTotal };
				});
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		const socket = get().socket;
		if (!socket) return;

		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			// clear unread for this conversation
			set((state) => {
				const nextUnread = { ...state.unreadCounts };
				const prevCount = nextUnread[userId] || 0;
				if (prevCount > 0) {
					delete nextUnread[userId];
				}
				const nextTotal = Math.max(0, (state.totalUnread || 0) - prevCount);
				return { messages: response.data, unreadCounts: nextUnread, totalUnread: nextTotal };
			});
		} catch (error: any) {
			set({ error: error?.response?.data?.message ?? "Failed to fetch messages" });
		} finally {
			set({ isLoading: false });
		}
	},
}));
