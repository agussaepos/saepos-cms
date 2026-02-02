import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, user, setAuth, logout } = useAuthStore.getState();

      if (!refreshToken || !user) {
        logout();
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        // We use a new axios instance to avoid infinite loops if this fails
        const refreshResponse = await axios.post(`${baseURL}/api/v1/cms/auth/refresh`, {
          userId: user.id,
          refreshToken,
        });

        const newTokens = refreshResponse.data.data;

        // Update store
        setAuth({
          user,
          token: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
