export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  isVisible: boolean;
}