import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import { toast } from "react-hot-toast";
//import { io } from "socket.io-client"

export const useAuthStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: false,
	onlineUsers: [],
	socket: null,
	allUsers: [],

	signup: async ({ name, phone, password, }) => {
		set({ loading: true })
		
		try {
			const res = await axiosInstance.post("/auth/signup", { name, phone, password })
			console.log(res)
			set({ user: res.data, loading: false })
			toast.success("Account created successfully")
			//get().connectSocket()
		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.message || "An error occurred")

		}
	},
	login: async ({phone, password}) => {
		set({ loading: true })

		try {
			const res = await axiosInstance.post("/auth/login", { phone, password })
			set({ user: res.data, loading: false })
			toast.success("Login successful")
			//get().connectSocket()
		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.message || "An error occurred")
		}
	},
	loginWithGoogle: async (token) => {
		set({ loading: true })
		try {

			const res = await axiosInstance.post(`/auth/login/google`, { token })
			set({ user: res.data, loading: false })
			toast.success("Google sign-in successful")
			//get().connectSocket()

		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.message || "An error occurred")
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout")
			set({ user: null })
			toast.success("Logout successful")
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout")
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.get("/auth/profile")
			set({ user: response.data, checkingAuth: false })
			//get().connectSocket()
		} catch (error) {
			console.log(error)
			set({ checkingAuth: false, user: null })
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return

		set({ checkingAuth: true })
		try {
			const response = await axiosInstance.post("/auth/refresh-token");

			set({ user: response.data, checkingAuth: false })
			console.log("refresh")
			return response.data

		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error
		}
	},

	/*connectSocket: () => {
		const { user } = get();
		if (!user || get().socket?.connected) return;

		const socket = io(BASE_URL, {
			query: {
				userId: user._id,
			},
		});
		socket.connect();

		set({ socket: socket });

		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds });
		});
	},

	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	},
*/
	getUser: async (userId) => {
		set({ loading: true })
		try {
			const res = await axiosInstance.get(`/auth/user/${userId}`)
			set({ seller: res.data, loading: false })
		} catch (error) {
			console.log("Error in getUser",error)
		}
	},
	
	getAllUsers: async () => {
		try {
            const res = await axiosInstance.get('/auth/get-all-users')
			console.log("res",res)
            set({ allUsers: res.data, loading: false })
        } catch (error) {
            toast.error(error.response.data.message)
        }
	},

}));





// Axios interceptor for token refresh
let refreshPromise = null

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise
					return axiosInstance(originalRequest)
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken()
				await refreshPromise
				refreshPromise = null

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout()
				return Promise.reject(refreshError)
			}
		}
		return Promise.reject(error)
	}
);