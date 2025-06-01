export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  published: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: {
    id: string;
    user: {
      id: string;
    };
  }[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface FilterState {
  categoryId?: string;
  sortBy: 'latest' | 'oldest' | 'title';
}
