import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

export const register = async (username: string, email: string, password: string, age: number, gender: boolean, phone_number: number) => {
  return api.post('/auth/register', { username, email, password, age, gender, phone_number });
};

export const login = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const logout = async () => {
  return api.post('/auth/logout');
};


export const checkAuth = async () => {
  return api.get('/auth/check-auth');
};

export const refreshToken = async () => {
  return api.post('/auth/refresh-token');
};

export const getPosts = async (title?: string) => {
  return api.get('/posts', { params: { title } });
};

export const createPost = async (post: { title: string; content: string; price: number }) => {
  return api.post('/posts', post);
};

export const updatePost = async (id: number, post: { title: string; content: string; price: number, category_id: number }) => {
  return api.put(`/posts/${id}`, post);
};

export const deletePost = async (id: number) => {
  return api.delete(`/posts/${id}`);
};

export const getUserPosts = async () => {
  return api.get('/posts/get-user-posts');
}

export const getPostById = async (id: number) => {
  return api.get(`/posts/${id}`);
}

export const getAllCategories = async () => {
  return api.get('/categories/all-categories');
}