export interface Blog {
  _id: string;
  title: string;
  banner: {
    public_id: string;
    url: string;
  };
  images?: {
    public_id: string;
    url: string;
  }[];
  subtitle?: string;
  body: string;
  date: string;
  tags: string[];
  visibility: 'public' | 'private' | 'draft';
  slug: string;
  author: string;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  _id?: string;
  title: string;
  banner: {
    public_id: string;
    url: string;
  };
  images?: {
    public_id: string;
    url: string;
  }[];
  subtitle?: string;
  body: string;
  tags: string[];
  visibility: 'public' | 'private' | 'draft';
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  author?: string;
  readTime?: number;
}