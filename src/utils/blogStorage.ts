import { Blog, BlogFormData } from '@/types/blog';

const BLOGS_KEY = 'muheet_blogs';

export const blogStorage = {
  getAll: (): Blog[] => {
    const blogs = localStorage.getItem(BLOGS_KEY);
    return blogs ? JSON.parse(blogs) : [];
  },

  save: (blogs: Blog[]): void => {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  },

  create: (data: BlogFormData): Blog => {
    const blogs = blogStorage.getAll();
    const newBlog: Blog = {
      id: Date.now().toString(),
      ...data,
      author: 'Muheet Bharti',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };
    
    const updatedBlogs = [...blogs, newBlog];
    blogStorage.save(updatedBlogs);
    return newBlog;
  },

  update: (id: string, data: Partial<BlogFormData>): Blog | null => {
    const blogs = blogStorage.getAll();
    const index = blogs.findIndex(blog => blog.id === id);
    
    if (index === -1) return null;
    
    const updatedBlog = {
      ...blogs[index],
      ...data,
      updatedAt: new Date().toISOString(),
      slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : blogs[index].slug
    };
    
    blogs[index] = updatedBlog;
    blogStorage.save(blogs);
    return updatedBlog;
  },

  delete: (id: string): boolean => {
    const blogs = blogStorage.getAll();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    
    if (filteredBlogs.length === blogs.length) return false;
    
    blogStorage.save(filteredBlogs);
    return true;
  },

  findById: (id: string): Blog | null => {
    const blogs = blogStorage.getAll();
    return blogs.find(blog => blog.id === id) || null;
  }
};