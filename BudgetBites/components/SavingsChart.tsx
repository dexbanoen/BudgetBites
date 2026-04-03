import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { Meal } from '@/types';

interface Props {
  selectedMeals: Meal[];
}

const BAR_MAX_HEIGHT = 110;
const BAR_WIDTH = 28;
const BAR_GAP = 6;
const GROUP_GAP = 18;

export function SavingsChart({ selectedMeals }: Props) {
  const hasMeals = selectedMeals.length > 0;

  const maxValue = hasMeals
    ? Math.max(...selectedMeals.map(m => m.restaurantPrice))
    : 1;

  const totalSaved = selectedMeals.reduce(
    (sum, m) => sum + (m.restaurantPrice - m.estimatedCost), 0
  );
  const totalHome = selectedMeals.reduce((sum, m) => sum + m.estimatedCost, 0);
  const totalRestaurant = selectedMeals.reduce((sum, m) => sum + m.restaurantPrice, 0);
  const savingsPct = totalRestaurant > 0
    ? Math.round((totalSaved / totalRestaurant) * 100)
    : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>SAVINGS BREAKDOWN</Text>

      {!hasMeals ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>Select meals to see your savings chart</Text>
        </View>
      ) : (
        <>
          {/* Summary row */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue} numberOfLines={1}>${totalSaved.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Total saved</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{savingsPct}%</Text>
              <Text style={styles.summaryLabel}>Less than dining out</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue} numberOfLines={1}>${totalHome.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Your cost</Text>
            </View>
          </View>

          {/* Bar Chart */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartScroll}
          >
            {/* Y-axis guide lines */}
            <View style={styles.chartArea}>
              <View style={styles.gridLines}>
                {[1, 0.75, 0.5, 0.25].map(fraction => (
                  <View key={fraction} style={[styles.gridLine, { bottom: fraction * BAR_MAX_HEIGHT }]}>
                    <Text style={styles.gridLabel}>${(maxValue * fraction).toFixed(0)}</Text>
                  </View>
                ))}
              </View>

              {/* Bars */}
              <View style={styles.barsRow}>
                {selectedMeals.map(meal => {
                  const homeH = Math.max(4, (meal.estimatedCost / maxValue) * BAR_MAX_HEIGHT);
                  const restH = Math.max(4, (meal.restaurantPrice / maxValue) * BAR_MAX_HEIGHT);
                  const shortName = meal.name.length > 10
                    ? meal.name.slice(0, 9) + '…'
                    : meal.name;

                  return (
                    <View key={meal.id} style={styles.barGroup}>
                      {/* Value labels on top */}
                      <View style={styles.barValuesRow}>
                        <Text style={styles.barValueHome}>${meal.estimatedCost.toFixed(0)}</Text>
                        <Text style={styles.barValueRest}>${meal.restaurantPrice.toFixed(0)}</Text>
                      </View>

                      {/* The two bars */}
                      <View style={[styles.barsContainer, { height: BAR_MAX_HEIGHT }]}>
                        <View style={[styles.bar, styles.barHome, { height: homeH }]} />
                        <View style={{ width: BAR_GAP }} />
                        <View style={[styles.bar, styles.barRestaurant, { height: restH }]} />
                      </View>

                      {/* Meal label */}
                      <Text style={styles.barLabel} numberOfLines={2}>{shortName}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
              <Text style={styles.legendText}>Home cooking</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#B8860B' }]} />
              <Text style={styles.legendText}>Restaurant</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    ...AppShadow.card,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    borderRadius: AppRadius.button,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: AppColors.separator,
  },

  // Chart
  chartScroll: {
    paddingRight: 8,
  },
  chartArea: {
    position: 'relative',
    paddingLeft: 36,
    paddingBottom: 4,
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: BAR_MAX_HEIGHT,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 10,
    color: AppColors.textSecondary,
    width: 30,
    textAlign: 'right',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: GROUP_GAP,
  },
  barGroup: {
    alignItems: 'center',
    width: BAR_WIDTH * 2 + BAR_GAP,
  },
  barValuesRow: {
    flexDirection: 'row',
    gap: BAR_GAP,
    marginBottom: 4,
  },
  barValueHome: {
    width: BAR_WIDTH,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    color: '#34C759',
  },
  barValueRest: {
    width: BAR_WIDTH,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '500',
    color: '#B8860B',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 6,
  },
  barHome: {
    backgroundColor: '#34C759',
  },
  barRestaurant: {
    backgroundColor: '#B8860B',
  },
  barLabel: {
    fontSize: 10,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    width: BAR_WIDTH * 2 + BAR_GAP,
    lineHeight: 13,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
});
