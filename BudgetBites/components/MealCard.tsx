import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { Meal } from '@/types';

interface Props {
  meal: Meal;
  selected: boolean;
  onPress: () => void;
}

const TAG_LABELS: Record<string, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'GF',
  'dairy-free': 'DF',
  'nut-free': 'NF',
};

export function MealCard({ meal, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓</Text>
        </View>
      )}

      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>{meal.name}</Text>
        <View style={styles.costBadge}>
          <Text style={styles.costText}>${meal.estimatedCost.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>{meal.description}</Text>

      {/* Macros Row */}
      <View style={styles.macrosRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.calories}</Text>
          <Text style={styles.macroLabel}>kcal</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.protein}g</Text>
          <Text style={styles.macroLabel}>protein</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.carbs}g</Text>
          <Text style={styles.macroLabel}>carbs</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.fat}g</Text>
          <Text style={styles.macroLabel}>fat</Text>
        </View>
      </View>

      {/* Tags + Cook Time */}
      <View style={styles.bottomRow}>
        <View style={styles.tags}>
          {meal.dietaryTags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{TAG_LABELS[tag]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.clockIcon}>⏱</Text>
          <Text style={styles.timeText}>{meal.cookingTime} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...AppShadow.card,
  },
  cardSelected: {
    borderColor: AppColors.primary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingRight: 28,
  },
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  costBadge: {
    backgroundColor: '#EAF3FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: AppRadius.pill,
    marginLeft: 8,
  },
  costText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.primary,
  },
  description: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  macrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    borderRadius: AppRadius.button,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  macroLabel: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 1,
  },
  macroDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: AppColors.separator,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    backgroundColor: AppColors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: AppRadius.pill,
  },
  tagText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockIcon: {
    fontSize: 15,
  },
  timeText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
});
