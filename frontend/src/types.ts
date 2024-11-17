export interface Post {
  id: number;
  title: string;
  content: string;
  price: number;
  user_id: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  isAuthenticated: boolean;
}