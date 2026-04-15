export type DishCategory =
  | 'مشويات'
  | 'حلويات'
  | 'مقبلات'
  | 'أصناف رئيسية'
  | 'شوربات'
  | 'سلطات'
  | 'مشروبات'
  | 'فطائر';

export type DishCategoryEn =
  | 'Grills'
  | 'Sweets'
  | 'Appetizers'
  | 'Main Dishes'
  | 'Soups'
  | 'Salads'
  | 'Drinks'
  | 'Pastries';

export interface Dish {
  id: string;
  kitchenId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: DishCategory;
  categoryEn: DishCategoryEn;
  prepTime: number;
  maxPortions: number;
  available: boolean;
  imageUrl: string | null;
  createdAt: string;
}
