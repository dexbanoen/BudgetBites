import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { CheckboxItem } from '@/components/CheckboxItem';
import { AppColors, AppRadius, AppShadow } from '@/constants/theme';
import { DietaryTag } from '@/types';

const DIETARY_OPTIONS: { tag: DietaryTag; label: string }[] = [
  { tag: 'vegetarian', label: 'Vegetarian' },
  { tag: 'vegan', label: 'Vegan' },
  { tag: 'gluten-free', label: 'Gluten-Free' },
  { tag: 'dairy-free', label: 'Dairy-Free' },
  { tag: 'nut-free', label: 'Nut-Free' },
];

const TIME_OPTIONS = [15, 30, 45, 60];

export default function PreferencesScreen() {
  const { preferences, setPreferences } = useAppContext();

  const [budget, setBudget] = useState(String(preferences.budget));
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryTag[]>(
    preferences.dietaryRestrictions
  );
  const [maxCookingTime, setMaxCookingTime] = useState(preferences.maxCookingTime);

  const toggleDietary = (tag: DietaryTag) => {
    setDietaryRestrictions(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFindMeals = () => {
    const parsedBudget = parseFloat(budget);
    setPreferences({
      budget: isNaN(parsedBudget) || parsedBudget <= 0 ? 10 : parsedBudget,
      dietaryRestrictions,
      maxCookingTime,
    });
    router.navigate('/(tabs)/suggestions');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <Text style={styles.title}>Preferences</Text>
          <Text style={styles.subtitle}>Tell us what works for you.</Text>

          {/* Budget */}
          <Text style={styles.sectionHeader}>BUDGET PER MEAL</Text>
          <View style={styles.card}>
            <View style={styles.budgetRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.budgetInput}
                value={budget}
                onChangeText={setBudget}
                keyboardType="decimal-pad"
                placeholder="10.00"
                placeholderTextColor={AppColors.textSecondary}
                returnKeyType="done"
                selectTextOnFocus
              />
            </View>
          </View>

          {/* Dietary Restrictions */}
          <Text style={styles.sectionHeader}>DIETARY RESTRICTIONS</Text>
          <View style={[styles.card, styles.cardNoPadding]}>
            {DIETARY_OPTIONS.map((opt, idx) => (
              <View key={opt.tag}>
                <CheckboxItem
                  label={opt.label}
                  checked={dietaryRestrictions.includes(opt.tag)}
                  onToggle={() => toggleDietary(opt.tag)}
                />
                {idx === DIETARY_OPTIONS.length - 1 && <View style={styles.cardLastSeparator} />}
              </View>
            ))}
          </View>

          {/* Max Cooking Time */}
          <Text style={styles.sectionHeader}>MAX COOKING TIME</Text>
          <View style={styles.card}>
            <View style={styles.timeOptions}>
              {TIME_OPTIONS.map(time => {
                const active = maxCookingTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timePill, active && styles.timePillActive]}
                    onPress={() => setMaxCookingTime(time)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.timePillText, active && styles.timePillTextActive]}>
                      {time} min
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Find Meals Button */}
          <TouchableOpacity style={styles.findButton} onPress={handleFindMeals} activeOpacity={0.8}>
            <Text style={styles.findButtonText}>Find Meals  →</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 20,
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 28,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: AppRadius.card,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    ...AppShadow.card,
  },
  cardNoPadding: {
    padding: 0,
    overflow: 'hidden',
  },
  cardLastSeparator: {
    height: 0,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '300',
    color: AppColors.textPrimary,
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '300',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
    padding: 0,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  timePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: AppRadius.button,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
    alignItems: 'center',
  },
  timePillActive: {
    backgroundColor: AppColors.primary,
  },
  timePillText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
    letterSpacing: -0.3,
  },
  timePillTextActive: {
    color: '#FFFFFF',
  },
  findButton: {
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.button,
    marginHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
});
