import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://blogging-6h9z.onrender.com/api' 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me')
};

export const postsAPI = {
  getAll: () => API.get('/posts'),
  getOne: (id) => API.get(`/posts/${id}`),
  create: (postData) => API.post('/posts', postData),
  update: (id, postData) => API.put(`/posts/${id}`, postData),
  delete: (id) => API.delete(`/posts/${id}`),
  addComment: (id, content) => API.post(`/posts/${id}/comments`, { content }),
  like: (id) => API.post(`/posts/${id}/like`)
};

export default API;
