import { GlucoseLog } from '@prisma/client';

export type GlucoseLogByDay = Record<string, GlucoseLog[]>;
