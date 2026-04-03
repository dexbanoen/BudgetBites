import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { MealCard } from '@/components/MealCard';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { Meal, Preferences } from '@/types';
import mealsData from '@/data/meals.json';

const allMeals = mealsData as Meal[];

function filterMeals(meals: Meal[], prefs: Preferences): Meal[] {
  return meals.filter(meal => {
    const withinBudget = meal.estimatedCost <= prefs.budget;
    const withinTime = meal.cookingTime <= prefs.maxCookingTime;
    const meetsRestrictions = prefs.dietaryRestrictions.every(tag =>
      meal.dietaryTags.includes(tag)
    );
    return withinBudget && withinTime && meetsRestrictions;
  });
}

export default function SuggestionsScreen() {
  const { preferences, selectedMeals, toggleMealSelection } = useAppContext();

  const filteredMeals = filterMeals(allMeals, preferences);
  const totalSelectedCost = selectedMeals.reduce((sum, m) => sum + m.estimatedCost, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Suggestions</Text>
          <Text style={styles.subtitle}>
            {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''} found
          </Text>
        </View>

{/* Meals List or Empty State */}
        {filteredMeals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🥗</Text>
              <Text style={styles.emptyTitle}>No meals match your filters</Text>
              <Text style={styles.emptyBody}>Try increasing your budget or cooking time, or removing some dietary restrictions.</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.navigate('/(tabs)/preferences')}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyButtonText}>Adjust Preferences</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredMeals}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MealCard
                meal={item}
                selected={selectedMeals.some(m => m.id === item.id)}
                onPress={() => toggleMealSelection(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Sticky Bottom Bar */}
        {selectedMeals.length > 0 && (
          <View style={styles.stickyBar}>
            <View>
              <Text style={styles.stickyCount}>
                {selectedMeals.length} meal{selectedMeals.length !== 1 ? 's' : ''} selected
              </Text>
              <Text style={styles.stickyCost}>${totalSelectedCost.toFixed(2)} est. total</Text>
            </View>
            <TouchableOpacity
              style={styles.groceryButton}
              onPress={() => router.navigate('/(tabs)/grocery')}
              activeOpacity={0.8}
            >
              <Text style={styles.groceryButtonText}>Grocery List  →</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyCard: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    padding: 28,
    alignItems: 'center',
    ...AppShadow.card,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 15,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: -0.3,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.separator,
    ...AppShadow.card,
  },
  stickyCount: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  stickyCost: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  groceryButton: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  groceryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
