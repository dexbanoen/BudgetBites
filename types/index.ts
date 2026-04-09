export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  averagePrice: number;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'halal';

export interface Meal {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  estimatedCost: number;
  restaurantPrice: number;
  cookingTime: number;
  dietaryTags: DietaryTag[];
  macros: Macros;
}

export interface Preferences {
  budget: number;
  dietaryRestrictions: DietaryTag[];
  maxCookingTime: number;
}

export interface GroceryItem {
  id: string;
  mealId: string;
  mealName: string;
  ingredient: Ingredient;
  checked: boolean;
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface AppContextType {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
  selectedDay: DayKey;
  setSelectedDay: (day: DayKey) => void;
  mealsByDay: Record<DayKey, Meal[]>;
  selectedMeals: Meal[];
  toggleMealSelection: (meal: Meal) => void;
  groceryItems: GroceryItem[];
  toggleGroceryItem: (id: string) => void;
  clearSelections: () => void;
}
