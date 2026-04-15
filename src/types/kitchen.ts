export type CairoArea =
  | 'Maadi'
  | 'Zamalek'
  | 'Heliopolis'
  | 'Nasr City'
  | 'Dokki'
  | 'Mohandessin'
  | 'New Cairo'
  | '6th October';

export interface Kitchen {
  id: string;
  chefId: string;
  name: string;
  nameEn: string;
  bio: string;
  bioEn: string;
  cuisineTags: string[];
  area: CairoArea;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  coverImage: string;
  isOpen: boolean;
  createdAt: string;
}
