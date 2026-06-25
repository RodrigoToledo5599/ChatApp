import axios from "axios";

export const http = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: "http://localhost:3000",
    withCredentials: true
});


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
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

    const isAuthRoute = originalRequest.url?.includes('refresh-token') || 
                        originalRequest.url?.includes('login');

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
        
        await http.post('/refresh-token');
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