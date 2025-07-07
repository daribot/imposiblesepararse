
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  post_id: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  likes: number;
}
