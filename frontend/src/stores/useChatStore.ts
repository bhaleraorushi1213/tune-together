import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface ChatStore {
	users: any[];
	isUsersLoading: boolean;
	error: string | null;
	fetchUsers: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
	users: [],
	isUsersLoading: false,
	error: null,

	fetchUsers: async () => {
		set({ isUsersLoading: true, error: null });

		try {
			const reponse = await axiosInstance.get("/users");
			set({ users: reponse.data });
		} catch (error: any) {
			set({ error : error.response.data.message });
		} finally {
      set({ isUsersLoading: false });
    }
	},
}));
