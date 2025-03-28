import { MealType } from '@prisma/client';

export type GlucoseLogMapItem = {
  label: string;
  maxValue: number;
};

export type GlucoseLogMap = {
  [key in MealType]: GlucoseLogMapItem;
};

export const glucoseLogMap: GlucoseLogMap = {
  FASTING: {
    label: 'Em jejum',
    maxValue: 92,
  },
  AFTER_BREAKFAST: {
    label: 'Pós café',
    maxValue: 140,
  },
  AFTER_AM_SNACK: {
    label: 'Pós lanche matinal',
    maxValue: 140,
  },
  AFTER_LUNCH: {
    label: 'Pós almoço',
    maxValue: 140,
  },
  AFTER_PM_SNACK: {
    label: 'Pós lanche da tarde',
    maxValue: 140,
  },
  AFTER_DINNER: {
    label: 'Pós jantar',
    maxValue: 140,
  },
  AFTER_NIGHT_SNACK: {
    label: 'Pós ceia',
    maxValue: 140,
  },
  BEDTIME: {
    label: 'Antes de dormir',
    maxValue: 140,
  },
  POST_EXERCISE: {
    label: 'Pós exercício',
    maxValue: 140,
  },
  OTHER: {
    label: 'Outro',
    maxValue: 140,
  },
} as const;
