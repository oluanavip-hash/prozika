import { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  app_metadata: { [key: string]: any };
  user_metadata: { [key: string]: any };
  aud: string;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  league_id: number;
  image1: string;
  image2: string;
  price: number;
  created_at: string;
  leagues: {
    name: string;
  }
  stock?: ProductStock[];
}

export interface ProductStock {
  id: number;
  team_id: number;
  size: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  team: Team;
  size: string;
  quantity: number;
}

export interface League {
  id: number;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  balance: number;
}

export interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
  items: {
    name: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isMockUser: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
}
