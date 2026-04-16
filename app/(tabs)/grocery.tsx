import React from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { CheckboxItem } from '@/components/CheckboxItem';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { GroceryItem } from '@/types';

type Section = {
  title: string;
  meal: string;
  data: GroceryItem[];
};

export default function GroceryScreen() {
  const { selectedMeals, groceryItems, toggleGroceryItem } = useAppContext();

  const checkedCount = groceryItems.filter(i => i.checked).length;
  const totalCount = groceryItems.length;
  const progress = totalCount > 0 ? checkedCount / totalCount : 0;

  const sections: Section[] = selectedMeals.map(meal => ({
    title: meal.name,
    meal: meal.id,
    data: groceryItems.filter(item => item.mealId === meal.id),
  }));

  if (groceryItems.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Grocery List</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your list is empty</Text>
            <Text style={styles.emptyBody}>
              Select some meals first and your grocery list will appear here automatically.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.navigate('/(tabs)/suggestions')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Browse Meals  →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Grocery List</Text>
              <Text style={styles.subtitle}>
                {checkedCount} of {totalCount} items checked
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <TouchableOpacity
              style={styles.recipeButton}
              onPress={() => router.push(`/recipe/${section.meal}` as never)}
              activeOpacity={0.8}
            >
              <Text style={styles.recipeButtonText}>Recipe</Text>
            </TouchableOpacity>            
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const isLast = index === section.data.length - 1;
          return (
            <View style={[styles.itemWrapper, isLast && styles.itemWrapperLast]}>
              <CheckboxItem
                label={`${item.ingredient.quantity} ${item.ingredient.unit} ${item.ingredient.name}`}
                rightLabel={`$${item.ingredient.averagePrice.toFixed(2)}`}
                checked={item.checked}
                onToggle={() => toggleGroceryItem(item.id)}
              />
            </View>
          );
        }}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: AppColors.separator,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
    minWidth: 36,
    textAlign: 'right',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',    
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipeButton: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recipeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },  
  itemWrapper: {
    marginHorizontal: 16,
    backgroundColor: AppColors.card,
    overflow: 'hidden',
    ...AppShadow.card,
  },
  itemWrapperLast: {
    borderBottomLeftRadius: AppRadius.card,
    borderBottomRightRadius: AppRadius.card,
  },
  sectionFooter: {
    height: 16,
  },
  listContent: {
    paddingBottom: 48,
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
});
