import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

// Response interceptor — automatically refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 aaya aur pehle retry nahi kiya?
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get a new access token from the refresh token
        await axios.post("/api/auth/refresh", {}, { withCredentials: true })

        // Make the original request again.
        return api(originalRequest)
      } catch (refreshError) {
        
        // Refresh also failed → Redirect to login
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api