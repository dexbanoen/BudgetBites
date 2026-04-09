import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { SavingsChart, HOME_COLOR, REST_COLOR } from '@/components/SavingsChart';
import { DayKey } from '@/types';

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

function getTodayKey(): DayKey {
  const keys: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[new Date().getDay()];
}

export default function DashboardScreen() {
  const {
    preferences,
    selectedDay,
    setSelectedDay,
    mealsByDay,
    groceryItems,
    clearSelections,
  } = useAppContext();

  const todayKey = getTodayKey();
  const allMeals = Object.values(mealsByDay).flat();
  const totalCost = allMeals.reduce((sum, m) => sum + m.estimatedCost, 0);
  const totalRestaurant = allMeals.reduce((sum, m) => sum + m.restaurantPrice, 0);
  const totalSavings = totalRestaurant - totalCost;

  const dayMeals = mealsByDay[selectedDay];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/budgetbites logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>You're saving this week</Text>
          <Text style={styles.heroAmount}>
            ${totalSavings > 0 ? totalSavings.toFixed(2) : '0.00'}
          </Text>
          <Text style={styles.heroSub}>
            {'Home Cooking  ·  '}
            <Text style={{ color: HOME_COLOR }}>${totalCost.toFixed(2)}</Text>
            {'  vs.  Restaurant  ·  '}
            <Text style={{ color: REST_COLOR }}>${totalRestaurant.toFixed(2)}</Text>
          </Text>
        </View>

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{allMeals.length}</Text>
            <Text style={styles.statLabel}>Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Weekly Cost</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{groceryItems.length}</Text>
            <Text style={styles.statLabel}>Grocery Items</Text>
          </View>
        </View>

        {/* ── Line graph — full bleed ── */}
        <SavingsChart mealsByDay={mealsByDay} />

        {/* ── Day selector ── */}
        <View style={styles.daySelector}>
          {DAYS.map(({ key, label }) => {
            const isSelected = key === selectedDay;
            const isToday = key === todayKey;
            const hasMeals = mealsByDay[key].length > 0;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                onPress={() => setSelectedDay(key)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dayPillText,
                  isSelected && styles.dayPillTextSelected,
                  isToday && !isSelected && styles.dayPillTextToday,
                ]}>
                  {label}
                </Text>
                {hasMeals && !isSelected && <View style={styles.dayDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Weekly meals card (like "Top Collected") ── */}
        <View style={styles.weekCard}>
          <View style={styles.weekCardHeader}>
            <Text style={styles.weekCardTitle}>
              {DAYS.find(d => d.key === selectedDay)?.label}'s Meals
            </Text>
            {allMeals.length > 0 && (
              <TouchableOpacity onPress={clearSelections}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          {dayMeals.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyRow}
              onPress={() => router.navigate('/(tabs)/suggestions')}
              activeOpacity={0.75}
            >
              <Text style={styles.emptyRowIcon}>🍽</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.emptyRowTitle}>No meals planned</Text>
                <Text style={styles.emptyRowSub}>Tap to browse suggestions</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>
          ) : (
            <>
              {dayMeals.map((meal, idx) => (
                <View
                  key={meal.id}
                  style={[
                    styles.mealRow,
                    idx < dayMeals.length - 1 && styles.mealRowBorder,
                  ]}
                >
                  <View style={styles.mealRowLeft}>
                    <Text style={styles.mealRowName}>{meal.name}</Text>
                    <Text style={styles.mealRowMeta}>
                      {meal.macros.calories} kcal  ·  {meal.macros.protein}g protein  ·  {meal.cookingTime} min
                    </Text>
                  </View>
                  <View style={styles.mealRowRight}>
                    <Text style={styles.mealRowCost}>${meal.estimatedCost.toFixed(2)}</Text>
                    <Text style={styles.mealRowSave}>
                      save ${(meal.restaurantPrice - meal.estimatedCost).toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.rowArrow}>›</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addRow}
                onPress={() => router.navigate('/(tabs)/suggestions')}
                activeOpacity={0.7}
              >
                <Text style={styles.addRowText}>+ Add more meals</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.navigate('/(tabs)/preferences')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Plan Meals  →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  content: { paddingBottom: 48 },

  // Header
  header: {
    height: 60,
    overflow: 'visible',
    alignItems: 'center',
  },
  logo: { width: 160, height: 100 },
  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  heroLabel: {
    fontSize: 15,
    color: AppColors.textSecondary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 56,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: -2,
    lineHeight: 62,
  },
  heroSub: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 6,
    letterSpacing: -0.2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statItem: { flex: 1 },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: AppColors.separator,
    marginHorizontal: 16,
    alignSelf: 'center',
  },


  // Day selector
  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 4,
  },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: AppRadius.pill,
  },
  dayPillSelected: { backgroundColor: AppColors.primary },
  dayPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.textSecondary,
  },
  dayPillTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  dayPillTextToday: { color: AppColors.primary, fontWeight: '600' },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.primary,
    marginTop: 3,
  },

  // Weekly card
  weekCard: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.separator,
    ...AppShadow.card,
  },
  weekCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: AppColors.primary,
  },
  weekCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  clearText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },
  emptyRowIcon: { fontSize: 24 },
  emptyRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  emptyRowSub: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  rowArrow: {
    fontSize: 22,
    color: AppColors.separator,
    fontWeight: '300',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  mealRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.separator,
  },
  mealRowLeft: { flex: 1 },
  mealRowName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  mealRowMeta: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 3,
  },
  mealRowRight: { alignItems: 'flex-end', marginRight: 4 },
  mealRowCost: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  mealRowSave: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  addRow: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.separator,
  },
  addRowText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '500',
  },

  // CTA
  ctaButton: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
});
