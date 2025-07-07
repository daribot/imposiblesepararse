
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  postId: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  likes?: number;
  comments?: Comment[];
}
