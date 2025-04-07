// prisma/seed.ts
import { MealType, PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import { setHours, setMinutes, subDays } from 'date-fns';

const prisma = new PrismaClient();

const userId = '322a4fd7-9577-4a1b-bd2f-9ca7f75de950';

async function main() {
  // Generate logs for the last 180 days
  const daysToGenerate = 180;
  const mealTypes: MealType[] = [
    MealType.FASTING,
    MealType.AFTER_BREAKFAST,
    MealType.AFTER_LUNCH,
    MealType.AFTER_DINNER,
  ];

  // Base glucose values with realistic ranges
  const baseValues = {
    [MealType.FASTING]: { min: 75, max: 95 },
    [MealType.AFTER_BREAKFAST]: { min: 110, max: 140 },
    [MealType.AFTER_LUNCH]: { min: 100, max: 130 },
    [MealType.AFTER_DINNER]: { min: 120, max: 150 },
  };

  // Time offsets for each meal type (hours)
  const mealTimes = {
    [MealType.FASTING]: 7, // 7:00 AM
    [MealType.AFTER_BREAKFAST]: 9, // 9:00 AM
    [MealType.AFTER_LUNCH]: 14, // 2:00 PM
    [MealType.AFTER_DINNER]: 20, // 8:00 PM
  };

  for (let i = 0; i < daysToGenerate; i++) {
    const currentDate = subDays(new Date(), daysToGenerate - i - 1);
    const isWeekend = [0, 6].includes(currentDate.getDay());

    // Skip some days randomly (10% chance on weekends, 5% on weekdays)
    if (Math.random() < (isWeekend ? 0.1 : 0.05)) continue;

    for (const mealType of mealTypes) {
      // Skip some readings randomly (5% chance)
      if (Math.random() < 0.05) continue;

      const baseRange = baseValues[mealType as keyof typeof baseValues];
      let value = randomInt(baseRange.min, baseRange.max + 1);

      // Add occasional spikes (25% chance)
      if (Math.random() < 0.25) {
        value += randomInt(20, 50);
      }

      // Ensure values stay in safe range
      value = Math.max(60, Math.min(250, value));

      // Set the specific time with random minutes
      const logDate = setMinutes(
        setHours(currentDate, mealTimes[mealType as keyof typeof baseValues]),
        randomInt(0, 60)
      );

      await prisma.glucoseLog.create({
        data: {
          date: logDate,
          value,
          mealType,
          userId,
          notes: generateNote(mealType, value, isWeekend),
        },
      });
    }
  }

  console.log(
    `✅ Generated ${daysToGenerate} days of glucose logs for ${userId}`
  );
}

function generateNote(
  mealType: MealType,
  value: number,
  isWeekend: boolean
): string | undefined {
  // 10% chance of no note
  if (Math.random() < 0.1) return undefined;

  const notes = {
    [MealType.FASTING]: [
      'Woke up feeling great',
      'Slept poorly last night',
      'Forgot to take medication',
    ],
    [MealType.AFTER_BREAKFAST]: [
      'Ate oatmeal with fruit',
      'Had a big breakfast',
      'Skipped coffee today',
    ],
    [MealType.AFTER_LUNCH]: [
      'Light salad for lunch',
      'Ate at restaurant',
      'Home-cooked meal',
    ],
    [MealType.AFTER_DINNER]: [
      'Pasta for dinner',
      'Went out with friends',
      'Early dinner tonight',
    ],
  };

  const specialNotes = [];
  if (value > 180) specialNotes.push('High reading - check insulin');
  if (value < 70) specialNotes.push('Low reading - had juice');
  if (isWeekend) specialNotes.push('Weekend schedule');

  return [...(notes[mealType as keyof typeof notes] || []), ...specialNotes][
    randomInt(
      0,
      notes[mealType as keyof typeof notes].length + specialNotes.length
    )
  ];
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
