import axiosInstance from './axiosInstance.js';

// Blog API functions
export const getAllBlogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/blogs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBlogsByTag = async (tag, params = {}) => {
  try {
    const response = await axiosInstance.get(`/api/blogs/tag/${tag}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await axiosInstance.post('/api/blogs', blogData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const response = await axiosInstance.put(`/api/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPublicBlogs = async (params = {}) => {
  return getAllBlogs({ ...params, visibility: 'public' });
};

export const getDraftBlogs = async (params = {}) => {
  return getAllBlogs({ ...params, visibility: 'draft' });
};

export const searchBlogs = async (searchTerm, params = {}) => {
  return getAllBlogs({ ...params, search: searchTerm });
};

export const getBlogBySlug = async (slug) => {
  return getBlogById(slug);
};

export const publishBlog = async (id) => {
  return updateBlog(id, { visibility: 'public' });
};

export const unpublishBlog = async (id) => {
  return updateBlog(id, { visibility: 'draft' });
};

export const getRecentBlogs = async (limit = 5) => {
  return getAllBlogs({ limit, visibility: 'public', page: 1 });
};