export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Image {
  id: number;
  url: string;
  is_primary: boolean;
  spot_id: number;
  created_at: string;
}

export interface Spot {
  id: number;
  title: string;
  description: string | null;
  category: string;
  rating: number | null;
  latitude: number;
  longitude: number;
  address: string | null;
  best: string | null;
  best_time: string | null;
  price_level: number | null;
  user_id: number;
  user: User;
  images: Image[];
  created_at: string;
  updated_at: string | null;
}

export interface SpotsResponse {
  items: Spot[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type Category = 'cafe' | 'restaurant' | 'bar' | 'park' | 'museum' | 'shop' | 'other';

export const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: 'cafe', label: 'Cafe', color: '#22C55E' },
  { value: 'restaurant', label: 'Restaurant', color: '#F97316' },
  { value: 'bar', label: 'Bar', color: '#A855F7' },
  { value: 'park', label: 'Park', color: '#14B8A6' },
  { value: 'museum', label: 'Museum', color: '#3B82F6' },
  { value: 'shop', label: 'Shop', color: '#EC4899' },
  { value: 'other', label: 'Other', color: '#6B7280' },
];

export function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.color ?? '#6B7280';
}
