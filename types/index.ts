export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string | null;
  content: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  viewCount: number;
  authorId: string;
  likes: {
    id: string;
    user: {
      id: string;
    };
  }[];
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface PostOrderByInput {
  createdAt?: SortOrder;
  updatedAt?: SortOrder;
  title?: SortOrder;
  likes?: {
    _count?: SortOrder;
  };
} 