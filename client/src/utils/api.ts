import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
      return Promise.reject(
        new Error(
          'セッションの有効期限が切れました。再度ログインしてください。',
        ),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
