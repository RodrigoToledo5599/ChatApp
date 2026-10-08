import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});


let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void, reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = originalRequest.url?.includes('auth/refresh-token') || 
                        originalRequest.url?.includes('auth/login') ||
                        originalRequest.url?.includes('auth/logout');

    if (error.response?.status === 401 && isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return http(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        
        await http.post('auth/refresh-token');
        processQueue(null, "success");

        return http(originalRequest);
      } catch (refreshError) {

        processQueue(refreshError, null);
        
        if (typeof window !== "undefined") {
          window.location.href = '/?session=expired'; 
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);