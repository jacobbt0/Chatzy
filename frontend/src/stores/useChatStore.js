import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";



export const useChatStore = create((set, get) => ({
    messages: [],
    groupMessages: [],
    users: [],
    groups: [],
    selectedUser: null,
    selectedGroup: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isGroupsLoading: false,
    createGroup: false,
    groupId: null,
    incomingCall: false,

    setIncomingCall: (incomingCall) => set({ incomingCall}),
    
    setCreateGroup: (createGroup) => set({ createGroup }),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            if (userId) {
                const res = await axiosInstance.get(`/messages/receive/${userId}`);
                set({ messages: res.data });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages, } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
            set({ messages: [...messages, res.data] });
         
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    sendGroupMessage: async (messageData) => {
        const { selectedGroup, groupMessages } = get()
        try {
            const res = await axiosInstance.post(`/messages/send-group/${selectedGroup?._id}`, messageData);
            set({ groupMessages: [...groupMessages, res.data] });
           
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    createNewGroup: async (groupName) => {

        try {

            const res = await axiosInstance.post(`/messages/create`, { groupName })
            set({ groupId: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getGroupMessages: async (id) => {
        set({ isMessagesLoading: true });
        try {
            if (id) {
                const res = await axiosInstance.get(`/messages/group/${id}`);
                set({ groupMessages: res.data });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    joinGroup: async (id) => {
        try {

            const res = await axiosInstance.post(`/messages/join`, { id })
            set({ selectedGroup: res.data, createGroup: false })

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser, selectedGroup } = get(); 
        const socket = useAuthStore.getState().socket;
        if (selectedUser) {

        socket?.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser?._id
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    }

        if (selectedGroup) {
            
            socket?.emit("joinGroup", selectedGroup.groupName); // join the group room
            socket?.on("newGroupMessage", (groupMessage) => {
                set({
                    groupMessages: [...get().groupMessages, groupMessage],
                });
            });
        }
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getGroups: async () => {
        set({ isGroupsLoading: true })
        try {
            const res = await axiosInstance.get('/messages/group')
            set({ groups: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    setSelectedGroup: (selectedGroup) => set({ selectedGroup }),



}))