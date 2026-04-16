import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import mealsData from '@/data/meals.json';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { Meal } from '@/types';

const allMeals = mealsData as Meal[];

function buildRecipeSteps(meal: Meal): string[] {
  const name = meal.name.toLowerCase();

  if (name.includes('salad')) {
    return [
      'Rinse and chop all fresh vegetables into bite-sized pieces.',
      'Drain and rinse canned ingredients, then pat dry.',
      'Whisk olive oil, lemon juice or vinegar, salt, and pepper for dressing.',
      'Toss everything together and add cheese or herbs at the end.',
      'Taste, adjust seasoning, and serve immediately.',
    ];
  }

  if (name.includes('soup') || name.includes('curry')) {
    return [
      'Prep and chop all vegetables before you start cooking.',
      'Saute onion, garlic, and spices in oil for 2 to 3 minutes.',
      'Add main ingredients and liquids, then bring to a gentle boil.',
      'Reduce heat and simmer until flavors develop and texture is tender.',
      'Finish with fresh herbs or citrus, then serve hot.',
    ];
  }

  if (name.includes('baked') || name.includes('flatbread')) {
    return [
      'Preheat oven to 400F (205C) and line a tray if needed.',
      'Season or top ingredients and arrange on tray/flatbread.',
      'Bake until cooked through and lightly golden.',
      'Rest for 2 minutes to keep juices and texture balanced.',
      'Slice, garnish, and serve warm.',
    ];
  }

  if (name.includes('stir-fry') || name.includes('fried rice')) {
    return [
      'Prep all ingredients first so cooking stays fast and even.',
      'Heat a pan or wok over medium-high heat with oil.',
      'Cook protein first, then remove and set aside if needed.',
      'Stir-fry vegetables, add sauces, and return protein with starch.',
      'Toss everything for 1 to 2 minutes and serve hot.',
    ];
  }

  if (name.includes('taco') || name.includes('wrap')) {
    return [
      'Warm tortillas or wraps in a dry pan for about 30 seconds each side.',
      'Cook or season your filling ingredients until heated through.',
      'Prepare toppings like avocado, salsa, lettuce, or tomato.',
      'Assemble each taco/wrap and fold tightly.',
      'Serve right away with lime or sauce on the side.',
    ];
  }

  if (name.includes('omelette') || name.includes('shakshuka')) {
    return [
      'Whisk eggs with a pinch of salt and prep all mix-ins.',
      'Cook aromatics and vegetables first until softened.',
      'Add eggs and cook gently on medium-low heat.',
      'Add cheese or herbs near the end and cook to your preferred doneness.',
      'Serve immediately while hot and fluffy.',
    ];
  }

  if (name.includes('pasta') || name.includes('noodle')) {
    return [
      'Boil salted water and cook pasta/noodles until al dente.',
      'Reserve a little cooking water before draining.',
      'Build sauce/flavor base in a pan with oil, aromatics, and seasonings.',
      'Toss pasta/noodles with sauce and splash in reserved water as needed.',
      'Top with herbs or cheese and serve hot.',
    ];
  }

  return [
    'Prep and measure ingredients before turning on heat.',
    'Cook aromatics first to build flavor.',
    'Add the main ingredients and cook until done.',
    'Season to taste and adjust texture with liquid if needed.',
    'Plate and serve warm.',
  ];
}

export default function RecipeScreen() {
  const { meal } = useLocalSearchParams<{ meal?: string | string[] }>();
  const normalizedMeal = Array.isArray(meal) ? meal[0] : meal;
  const selectedMeal = allMeals.find(item => item.id === normalizedMeal);

  if (!selectedMeal) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Recipe not found</Text>
          <Text style={styles.errorBody}>This meal recipe is not available.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>Back to Grocery List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const steps = buildRecipeSteps(selectedMeal);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{selectedMeal.name}</Text>
        <Text style={styles.subtitle}>{selectedMeal.description}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>Time: {selectedMeal.cookingTime} min</Text>
          <Text style={styles.metaItem}>Est. Cost: ${selectedMeal.estimatedCost.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingredients</Text>
          {selectedMeal.ingredients.map(ingredient => (
            <Text key={ingredient.name} style={styles.listItem}>
              • {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recipe</Text>
          {steps.map((step, index) => (
            <Text key={`${selectedMeal.id}-step-${index}`} style={styles.listItem}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>Back to Grocery List</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: AppColors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 13,
    color: AppColors.textSecondary,
    backgroundColor: AppColors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AppRadius.pill,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    padding: 16,
    gap: 8,
    ...AppShadow.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    color: AppColors.textPrimary,
  },
  backButton: {
    marginTop: 8,
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    paddingVertical: 13,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  errorBody: {
    fontSize: 15,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
