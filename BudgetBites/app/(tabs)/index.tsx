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
import { SavingsChart } from '@/components/SavingsChart';
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

function getWeekDates(): Record<DayKey, number> {
  const today = new Date();
  const jsDay = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (jsDay === 0 ? 6 : jsDay - 1));
  const result = {} as Record<DayKey, number>;
  DAYS.forEach(({ key }, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result[key] = d.getDate();
  });
  return result;
}

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
    selectedMeals,
    groceryItems,
    clearSelections,
  } = useAppContext();

  const weekDates = getWeekDates();
  const todayKey = getTodayKey();

  const allMeals = Object.values(mealsByDay).flat();
  const totalCost = allMeals.reduce((sum, m) => sum + m.estimatedCost, 0);
  const totalRestaurantCost = allMeals.reduce((sum, m) => sum + m.restaurantPrice, 0);
  const totalSavings = totalRestaurantCost - totalCost;

  const dayMeals = mealsByDay[selectedDay];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/budgetbites logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Savings Widget */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsLeft}>
            <Text style={styles.savingsLabel}>You're saving</Text>
            <Text style={styles.savingsAmount}>
              ${totalSavings > 0 ? totalSavings.toFixed(2) : '0.00'}
            </Text>
            <Text style={styles.savingsSubtext}>vs. eating out</Text>
          </View>
          <View style={styles.savingsDivider} />
          <View style={styles.savingsRight}>
            <View style={styles.savingsCompareRow}>
              <Text style={styles.savingsCompareLabel}>Home cooking</Text>
              <Text style={styles.savingsCompareValue}>${totalCost.toFixed(2)}</Text>
            </View>
            <View style={styles.savingsBarTrack}>
              <View style={[styles.savingsBarFill, {
                width: totalRestaurantCost > 0
                  ? `${Math.round((totalCost / totalRestaurantCost) * 100)}%`
                  : '0%',
              }]} />
            </View>
            <View style={styles.savingsCompareRow}>
              <Text style={styles.savingsCompareLabel}>Restaurant</Text>
              <Text style={[styles.savingsCompareValue, { color: 'rgba(255,255,255,0.65)' }]}>
                ${totalRestaurantCost.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Text style={styles.cardTitle}>THIS WEEK</Text>
            {allMeals.length > 0 && (
              <TouchableOpacity onPress={clearSelections}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.daysRow}>
            {DAYS.map(({ key, label }) => {
              const isToday = key === todayKey;
              const isSelected = key === selectedDay;
              const hasMeals = mealsByDay[key].length > 0;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonSelected,
                    isToday && !isSelected && styles.dayButtonToday,
                  ]}
                  onPress={() => setSelectedDay(key)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelSelected,
                    isToday && !isSelected && styles.dayLabelToday,
                  ]}>
                    {label}
                  </Text>
                  <Text style={[
                    styles.dayDate,
                    isSelected && styles.dayDateSelected,
                  ]}>
                    {weekDates[key]}
                  </Text>
                  {hasMeals && (
                    <View style={[
                      styles.dot,
                      isSelected && styles.dotSelected,
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Day Meals */}
          <View style={styles.dayMealsSection}>
            {dayMeals.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyDayRow}
                onPress={() => router.navigate('/(tabs)/suggestions')}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyDayText}>No meals — tap to add</Text>
                <Text style={styles.emptyDayArrow}>→</Text>
              </TouchableOpacity>
            ) : (
              <>
                {dayMeals.map(meal => (
                  <View key={meal.id} style={styles.dayMealRow}>
                    <View style={styles.dayMealInfo}>
                      <Text style={styles.dayMealName}>{meal.name}</Text>
                      <Text style={styles.dayMealMeta}>
                        ${meal.estimatedCost.toFixed(2)}  ·  {meal.cookingTime} min  ·  {meal.macros.calories} kcal
                      </Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addMoreRow}
                  onPress={() => router.navigate('/(tabs)/suggestions')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addMoreText}>+ Add more meals</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>WEEKLY SUMMARY</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Budget per meal</Text>
            <Text style={styles.statValue}>${preferences.budget.toFixed(2)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total meals planned</Text>
            <Text style={styles.statValue}>{allMeals.length}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Est. weekly cost</Text>
            <Text style={[styles.statValue, { color: AppColors.primary }]}>
              ${totalCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Items to buy</Text>
            <Text style={styles.statValue}>{groceryItems.length}</Text>
          </View>
        </View>

        {/* Savings Chart */}
        <SavingsChart selectedMeals={allMeals} />

        {/* CTA */}
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
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  logo: {
    width: 140,
    height: 78,
  },

  // Savings Widget
  savingsCard: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.card,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...AppShadow.card,
  },
  savingsLeft: {
    alignItems: 'center',
    paddingRight: 20,
    minWidth: 110,
  },
  savingsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  savingsAmount: {
    fontSize: 34,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: -1,
    marginVertical: 2,
  },
  savingsSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  savingsDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginRight: 20,
  },
  savingsRight: {
    flex: 1,
    gap: 6,
  },
  savingsCompareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savingsCompareLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  savingsCompareValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  savingsBarTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  savingsBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },

  // Calendar
  calendarCard: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    ...AppShadow.card,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 14,
    color: AppColors.destructive,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 2,
    minHeight: 58,
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: AppColors.primary,
  },
  dayButtonToday: {
    backgroundColor: AppColors.background,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: '#FFFFFF',
  },
  dayLabelToday: {
    color: AppColors.primary,
    fontWeight: '600',
  },
  dayDate: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  dayDateSelected: {
    color: '#FFFFFF',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: AppColors.primary,
    marginTop: 4,
  },
  dotSelected: {
    backgroundColor: '#FFFFFF',
  },

  // Day Meals
  dayMealsSection: {
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.separator,
    paddingTop: 12,
  },
  emptyDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyDayText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
  },
  emptyDayArrow: {
    fontSize: 15,
    color: AppColors.primary,
  },
  dayMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.separator,
  },
  dayMealInfo: {
    flex: 1,
  },
  dayMealName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  dayMealMeta: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  addMoreRow: {
    paddingTop: 10,
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '500',
  },

  // Summary Card
  card: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    ...AppShadow.card,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 17,
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.separator,
  },
  ctaButton: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    marginHorizontal: 16,
    marginTop: 20,
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
