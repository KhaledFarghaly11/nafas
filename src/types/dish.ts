export type DishCategory =
  | 'مشويات'
  | 'حلويات'
  | 'مقبلات'
  | 'أصناف رئيسية'
  | 'شوربات'
  | 'سلطات'
  | 'مشروبات'
  | 'فطائر';

export interface Dish {
  id: string;
  kitchenId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: string;
  categoryEn: string;
  prepTime: number;
  maxPortions: number;
  available: boolean;
  imageUrl: string | null;
  createdAt: string;
}
