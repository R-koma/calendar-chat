import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const request = error.request as { responseURL?: string };

      const requestURL = request?.responseURL ?? '';

      if (requestURL.includes('/auth/')) {
        window.location.href = '/auth/login';
        return Promise.reject(
          new Error(
            'セッションの有効期限が切れました。再度ログインしてください。',
          ),
        );
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
