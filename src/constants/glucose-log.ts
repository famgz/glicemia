import { MealType } from '@prisma/client';

const MAX_VALUE_FASTING = 95;
const MAX_VALUE_PRE_MEAL = 100;
const MAX_VALUE_POST_MEAL = 140;

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
    maxValue: MAX_VALUE_FASTING,
  },
  AFTER_BREAKFAST: {
    label: 'Pós café',
    maxValue: MAX_VALUE_POST_MEAL,
  },
  AFTER_AM_SNACK: {
    label: 'Pós lanche matinal',
    maxValue: MAX_VALUE_POST_MEAL,
  },
  BEFORE_LUNCH: {
    label: 'Antes almoço',
    maxValue: MAX_VALUE_PRE_MEAL,
  },
  AFTER_LUNCH: {
    label: 'Pós almoço',
    maxValue: MAX_VALUE_POST_MEAL,
  },
  AFTER_PM_SNACK: {
    label: 'Pós lanche da tarde',
    maxValue: MAX_VALUE_POST_MEAL,
  },
  BEFORE_DINNER: {
    label: 'Antes jantar',
    maxValue: MAX_VALUE_PRE_MEAL,
  },
  AFTER_DINNER: {
    label: 'Pós jantar',
    maxValue: MAX_VALUE_POST_MEAL,
  },
  AFTER_NIGHT_SNACK: {
    label: 'Pós ceia',
    maxValue: MAX_VALUE_POST_MEAL,
  },
  BEDTIME: {
    label: 'Antes de dormir',
    maxValue: MAX_VALUE_PRE_MEAL,
  },
  POST_EXERCISE: {
    label: 'Pós exercício',
    maxValue: MAX_VALUE_PRE_MEAL,
  },
  OTHER: {
    label: 'Outro',
    maxValue: MAX_VALUE_POST_MEAL,
  },
} as const;
