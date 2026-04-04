import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppColors } from '@/constants/theme';
import { DayKey, Meal } from '@/types';

const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const HOME_COLOR = '#34C759';
export const REST_COLOR = '#B8860B';
const CHART_H = 200;
const LINE_W = 3;
const DOT_R = 5;
const SIDE_PAD = 20; // keeps first/last dots from clipping

interface Props {
  mealsByDay: Record<DayKey, Meal[]>;
}

type Point = { x: number; y: number };


function Segment({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return null;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return (
    <View style={{
      position: 'absolute',
      width: len,
      height: LINE_W,
      backgroundColor: color,
      borderRadius: LINE_W / 2,
      left: (x1 + x2) / 2 - len / 2,
      top: (y1 + y2) / 2 - LINE_W / 2,
      transform: [{ rotate: `${angle}deg` }],
    }} />
  );
}

export function SavingsChart({ mealsByDay }: Props) {
  const { width: screenW } = useWindowDimensions();
  const chartW = screenW;
  const xStep = (chartW - SIDE_PAD * 2) / 6; // 7 points, padded each side

  const dailyHome = DAY_KEYS.map(k =>
    mealsByDay[k].reduce((s, m) => s + m.estimatedCost, 0));
  const dailyRest = DAY_KEYS.map(k =>
    mealsByDay[k].reduce((s, m) => s + m.restaurantPrice, 0));

  // Cumulative running totals (all-time)
  const homeCosts = dailyHome.reduce<number[]>((acc, v) => {
    acc.push((acc[acc.length - 1] ?? 0) + v);
    return acc;
  }, []);
  const restCosts = dailyRest.reduce<number[]>((acc, v) => {
    acc.push((acc[acc.length - 1] ?? 0) + v);
    return acc;
  }, []);

  const maxVal = Math.max(...restCosts, ...homeCosts, 1);
  const TOP_PAD = 30;
  const BOT_PAD = 12;

  const px = (i: number) => SIDE_PAD + i * xStep;
  const py = (v: number) => TOP_PAD + (1 - v / maxVal) * (CHART_H - TOP_PAD - BOT_PAD);

  const homePoints: Point[] = homeCosts.map((v, i) => ({ x: px(i), y: py(v) }));
  const restPoints: Point[] = restCosts.map((v, i) => ({ x: px(i), y: py(v) }));

  const hasMeals = homeCosts.some(v => v > 0);

  // Smart label placement — above the dot, push apart if they'd collide
  const LABEL_H = 16;
  const LABEL_GAP = 4;
  function labelTop(v: number, otherV: number | null): number {
    const dotY = py(v);
    let top = dotY - DOT_R - LABEL_GAP - LABEL_H;
    // If it would clip the top, flip below
    if (top < 0) top = dotY + DOT_R + LABEL_GAP;
    // If the other label is very close, push this one further up
    if (otherV !== null) {
      const otherDotY = py(otherV);
      const otherTop = otherDotY - DOT_R - LABEL_GAP - LABEL_H;
      if (Math.abs(top - otherTop) < LABEL_H + 2) {
        top = Math.min(top, otherTop) - LABEL_H - 2;
        if (top < 0) top = Math.max(top, otherTop) + LABEL_H + 2;
      }
    }
    return top;
  }

  return (
    <View style={{ width: screenW }}>
      {/* Y-axis labels — overlaid top-left */}
      <View style={[styles.canvas, { height: CHART_H, width: chartW }]}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <View key={f} style={[styles.gridLine, { top: py(maxVal * f) }]}>
            <Text style={styles.yLabel}>${(maxVal * f).toFixed(0)}</Text>
          </View>
        ))}

        {hasMeals ? (
          <>
            {/* Restaurant line */}
            {restPoints.map((pt, i) => {
              if (i === 0) return null;
              const prev = restPoints[i - 1];
              return <Segment key={`r${i}`} x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y} color={REST_COLOR} />;
            })}

            {/* Home line */}
            {homePoints.map((pt, i) => {
              if (i === 0) return null;
              const prev = homePoints[i - 1];
              return <Segment key={`h${i}`} x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y} color={HOME_COLOR} />;
            })}

            {/* Restaurant dots */}
            {restCosts.map((v, i) => v > 0 && (
              <View key={`rd${i}`} style={[styles.dot, {
                left: px(i) - DOT_R,
                top: py(v) - DOT_R,
                backgroundColor: REST_COLOR,
              }]} />
            ))}

            {/* Home dots */}
            {homeCosts.map((v, i) => v > 0 && (
              <View key={`hd${i}`} style={[styles.dot, {
                left: px(i) - DOT_R,
                top: py(v) - DOT_R,
                backgroundColor: HOME_COLOR,
              }]} />
            ))}

            {/* End-of-line labels — placed above dots, collision-aware */}
            {homeCosts[6] > 0 && (
              <Text style={[styles.endLabel, {
                color: HOME_COLOR,
                left: px(6) - 24,
                top: labelTop(homeCosts[6], restCosts[6] > 0 ? restCosts[6] : null),
              }]}>
                ${homeCosts[6].toFixed(2)}
              </Text>
            )}
            {restCosts[6] > 0 && (
              <Text style={[styles.endLabel, {
                color: REST_COLOR,
                left: px(6) - 24,
                top: labelTop(restCosts[6], homeCosts[6] > 0 ? homeCosts[6] : null),
              }]}>
                ${restCosts[6].toFixed(2)}
              </Text>
            )}
          </>
        ) : (
          <View style={styles.emptyOverlay}>
            <Text style={styles.emptyText}>Plan meals to see your savings chart</Text>
          </View>
        )}

      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: HOME_COLOR }]} />
          <Text style={styles.legendText}>Home cooking</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: REST_COLOR }]} />
          <Text style={styles.legendText}>Restaurant</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.separator,
    flexDirection: 'row',
    alignItems: 'center',
  },
  yLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginLeft: 12,
    backgroundColor: AppColors.background,
    paddingHorizontal: 4,
  },
  dot: {
    position: 'absolute',
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    borderWidth: 2.5,
    borderColor: AppColors.background,
  },
  emptyOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendLine: { width: 20, height: LINE_W + 1, borderRadius: 2 },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textSecondary,
  },
  endLabel: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '700',
    width: 48,
    textAlign: 'center',
  },
});

