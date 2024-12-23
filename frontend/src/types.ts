export interface Post {
  id: number;
  title: string;
  content: string;
  price: number;
  user_id: number;
  created_at: string;
  category: Category[];
}

export interface Category {
  id: number;
  name: string;
}
export interface User {
  id: number;
  email: string;
  username: string;
  isAuthenticated: boolean;
}