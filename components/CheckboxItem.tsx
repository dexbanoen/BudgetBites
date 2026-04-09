import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppColors } from '@/constants/theme';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
  sublabel?: string;
  rightLabel?: string;
}

export function CheckboxItem({ label, checked, onToggle, sublabel, rightLabel }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.6}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>
      {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: AppColors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.separator,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: AppColors.separator,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
  },
  labelChecked: {
    color: AppColors.textSecondary,
    textDecorationLine: 'line-through',
  },
  sublabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  rightLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginLeft: 12,
  },
});
