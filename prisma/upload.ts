import { MealType, PrismaClient } from '@prisma/client';
import { fromZonedTime } from 'date-fns-tz';

const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

const prisma = new PrismaClient();

const userId = 'cm8ta5apn0001l203kj9qi56l';

type Data = {
  dates: number[], fasting: number, afterBreakfast: number, afterLunch: number, afterDinner: number, notes: string
}

const data: Data[] = [
{dates: [16,2,2025,8,17], fasting: 64, afterBreakfast: 129,afterLunch: 107,afterDinner:  51,notes: ''},
{dates: [17,2,2025,7,20], fasting: 98, afterBreakfast: 121,afterLunch: 135,afterDinner: 108,notes: ''},
{dates: [18,2,2025,8,27], fasting: 99, afterBreakfast: 131,afterLunch: 120,afterDinner: 122,notes: ''},
{dates: [19,2,2025,7,0], fasting: 95, afterBreakfast: 147,afterLunch: 128,afterDinner: 115,notes:  ''},
{dates: [20,2,2025,6,40], fasting: 93, afterBreakfast: 138,afterLunch: 109,afterDinner: 118,notes: ''},
{dates: [21,2,2025,7,30], fasting: 87, afterBreakfast: 98,afterLunch:   120,afterDinner: 144,notes: ''},
{dates: [22,2,2025,8,35], fasting: 94, afterBreakfast: 140,afterLunch: 107,afterDinner: 118,notes: ''},
{dates: [11,3,2025,8,25], fasting: 97, afterBreakfast: 152,afterLunch: 138,afterDinner: 120,notes: ''},
{dates: [12,3,2025,6,30], fasting: 78, afterBreakfast:   0,afterLunch:  105,afterDinner: 102,notes: 'TESTE 2 Jantar: fonte de proteína de 120g. Início Levoid 150mcg'},
{dates: [13,3,2025,8,15], fasting: 75, afterBreakfast: 140,afterLunch: 98,afterDinner:   116,notes: 'TESTE 1 Colação: 1 colher sopa de chia no leite com proteína + 1 ovo 78 laboratório'},
{dates: [14,3,2025,6,10], fasting: 83, afterBreakfast: 130,afterLunch: 120,afterDinner: 107,notes: 'TESTE 4 Lanche manhã: 16 castanhas'},
{dates: [15,3,2025,8,50], fasting: 82, afterBreakfast: 167,afterLunch: 94,afterDinner:   121,notes: 'TESTE 3 Lanche tarde: 1 ovo ou 30g de frango ou atum '},
{dates: [16,3,2025,9,11], fasting: 84, afterBreakfast: 124,afterLunch: 133,afterDinner: 104,notes: 'REF. LIVRE: JANTAR 180g Hamburger bovino com queijo cheddar e pão brioche, picles de cebola, molhos: barbecue e cheddar'},
{dates: [17,3,2025,7,36], fasting: 87, afterBreakfast: 151,afterLunch: 114,afterDinner: 120,notes: ''},
{dates: [18,3,2025,6,10], fasting: 84, afterBreakfast: 134,afterLunch: 120,afterDinner:  92,notes: 'TESTE 6 Caminhada à tarde'},
{dates: [19,3,2025,7,42], fasting: 80, afterBreakfast: 146,afterLunch: 107,afterDinner: 104,notes: 'TESTE5 E 7 Caminhada e musculação à noite 82 laboratório'},
{dates: [20,3,2025,8,10], fasting: 77, afterBreakfast: 137,afterLunch: 105,afterDinner: 100,notes: ''},
{dates: [21,3,2025,7,30], fasting: 80, afterBreakfast: 133,afterLunch: 117,afterDinner: 108,notes: 'REF. LIVRE: JANTAR CAFÉ: Tirei o mamão, JANTAR: 360g Hamburger bovino com queijo cheddar e pão brioche, picles de cebola, molhos: barbecue e cheddar'},
{dates: [22,3,2025,8,44], fasting: 82, afterBreakfast: 151,afterLunch: 96,afterDinner:   101,notes: ''},
{dates: [23,3,2025,10,1], fasting: 77, afterBreakfast: 169,afterLunch: 114,afterDinner:   0,notes: 'REF. LIVRE: JANTAR Maminha, batata noisette, macarrão ao pomodoro'},
{dates: [24,3,2025,7,37], fasting: 87, afterBreakfast: 101,afterLunch: 119,afterDinner: 100,notes: 'JANTAR: Início nova dieta 👈👈'},
{dates: [25,3,2025,8,5], fasting: 79, afterBreakfast: 173,afterLunch: 127,afterDinner: 110,notes: 'Medição 77 no laboratório'},
{dates: [26,3,2025,6,10], fasting: 78, afterBreakfast: 156,afterLunch: 129,afterDinner:  98,notes: ''},
{dates: [27,3,2025,8,30], fasting: 84, afterBreakfast: 149,afterLunch: 115,afterDinner: 116,notes: ''},
{dates: [28,3,2025,6,20], fasting: 78, afterBreakfast: 165,afterLunch: 123,afterDinner: 129,notes: 'CAFÉ: Substitui a aveia do mamão por chia'},
{dates: [29,3,2025,9,22], fasting: 88, afterBreakfast: 173,afterLunch: 107,afterDinner: 108,notes: ''},
{dates: [30,3,2025,9,30], fasting: 82, afterBreakfast: 158,afterLunch: 101,afterDinner: 100,notes: 'REF. LIVRE: JANTAR CAFÉ: Tirei o mamão com aveia JANTAR: 180g Hamburger bovino com queijo cheddar e pão brioche, picles de cebola, molhos: barbecue e cheddar'},
]

let res: {userId: string, date: Date, value: number, mealType: MealType, notes?: string}[] = []

async function main() {
  for (const {dates, fasting, afterBreakfast, afterLunch, afterDinner, notes} of data) {
    const [day, _month, year, hour, minute] = dates as number[]
    const month = _month -1 
    res.push( 
      {
        userId,
        date: fromZonedTime(new Date(year, month, day, hour, minute), DEFAULT_TIMEZONE),
        value: fasting,
        mealType: MealType.FASTING,
        notes: notes.trim()
      },
      {
        userId,
        date: fromZonedTime(new Date(year, month, day, 9), DEFAULT_TIMEZONE),
        value: afterBreakfast,
        mealType: MealType.AFTER_BREAKFAST
      },
      {
        userId,
        date: fromZonedTime(new Date(year, month, day, 13), DEFAULT_TIMEZONE),
        value: afterLunch,
        mealType: MealType.AFTER_LUNCH
      },
      {
        userId,
        date: fromZonedTime(new Date(year, month, day, 19), DEFAULT_TIMEZONE),
        value: afterDinner,
        mealType: MealType.AFTER_DINNER
      },
    )
  }
  res = res.filter(x => x.value)
  const response = await prisma.glucoseLog.createMany({ data: res , skipDuplicates: true });
  console.log(response)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
