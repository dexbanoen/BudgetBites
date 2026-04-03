import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AppContextType, DayKey, DietaryTag, GroceryItem, Meal, Preferences } from '@/types';

const DEFAULT_PREFERENCES: Preferences = {
  budget: 10,
  dietaryRestrictions: [] as DietaryTag[],
  maxCookingTime: 60,
};

const EMPTY_DAY_MEALS: Record<DayKey, Meal[]> = {
  mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
};

function getTodayKey(): DayKey {
  const keys: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[new Date().getDay()];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [selectedDay, setSelectedDay] = useState<DayKey>(getTodayKey());
  const [mealsByDay, setMealsByDay] = useState<Record<DayKey, Meal[]>>(EMPTY_DAY_MEALS);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const selectedMeals = mealsByDay[selectedDay];

  const toggleMealSelection = useCallback((meal: Meal) => {
    setMealsByDay(prev => {
      const dayMeals = prev[selectedDay];
      const exists = dayMeals.find(m => m.id === meal.id);
      return {
        ...prev,
        [selectedDay]: exists
          ? dayMeals.filter(m => m.id !== meal.id)
          : [...dayMeals, meal],
      };
    });
  }, [selectedDay]);

  // Grocery list aggregates from ALL days, deduped by meal+ingredient
  const groceryItems = useMemo<GroceryItem[]>(() => {
    const seen = new Set<string>();
    const items: GroceryItem[] = [];
    Object.values(mealsByDay).forEach(meals => {
      meals.forEach(meal => {
        meal.ingredients.forEach(ing => {
          const id = `${meal.id}-${ing.name}`;
          if (!seen.has(id)) {
            seen.add(id);
            items.push({
              id,
              mealId: meal.id,
              mealName: meal.name,
              ingredient: ing,
              checked: checkedIds.has(id),
            });
          }
        });
      });
    });
    return items;
  }, [mealsByDay, checkedIds]);

  const toggleGroceryItem = useCallback((id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearSelections = useCallback(() => {
    setMealsByDay(EMPTY_DAY_MEALS);
    setCheckedIds(new Set());
  }, []);

  const value: AppContextType = {
    preferences,
    setPreferences,
    selectedDay,
    setSelectedDay,
    mealsByDay,
    selectedMeals,
    toggleMealSelection,
    groceryItems,
    toggleGroceryItem,
    clearSelections,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
