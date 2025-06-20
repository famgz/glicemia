'use client';

import { GlucoseLog } from '@prisma/client';
import { useMemo, useState } from 'react';

import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/value';
import InfiniteLoadingTrigger from '@/components/infinite-loading-trigger';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  getUniqueMealTypesFromDailyGrouped,
  groupGlucoseLogsByDayAndMealType,
} from '@/utils/glucose-log';
import { invertDateString } from '@/utils/time';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

interface Props {
  glucoseLogs: GlucoseLog[];
}

const INITIAL_ITEMS_PER_LOAD = 50;
const ITEMS_PER_LOAD = 20;

export default function GlucoseLogTable({ glucoseLogs }: Props) {
  const [offset, setOffset] = useState(INITIAL_ITEMS_PER_LOAD);
  const glucoseLogsByDayAndMealType = useMemo(() => {
    const grouped = groupGlucoseLogsByDayAndMealType({
      glucoseLogs,
      fillDayGaps: false,
      timeZone: timeZone!,
    });
    grouped.sort((a, b) => b.date.localeCompare(a.date));
    return grouped;
  }, [glucoseLogs]);

  const croppedItems = useMemo(
    () => glucoseLogsByDayAndMealType.slice(0, offset),
    [glucoseLogsByDayAndMealType, offset]
  );

  const mealTypes = useMemo(
    () => getUniqueMealTypesFromDailyGrouped(croppedItems),
    [croppedItems]
  );

  return (
    <div className="mt-5 space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center max-sm:px-1 sm:w-32 sm:text-base">
              Data
            </TableHead>
            {mealTypes.map((mealType) => (
              <TableHead align="center" key={mealType} className="max-sm:px-1">
                <div className="flex-center">
                  <GlucoseLogMealTypeBadge
                    mealType={mealType}
                    className="whitespace-normal sm:px-3 sm:text-base"
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {croppedItems.map((item, index) => (
            <TableRow
              key={item.date}
              className={cn('hover:bg-muted', index % 2 === 0 && 'bg-muted/40')}
            >
              <TableCell
                align="center"
                className="text-foreground/80 font-medium max-sm:p-1 max-sm:text-xs"
              >
                {invertDateString(item.date)}
              </TableCell>
              {mealTypes.map((mealType) => (
                <TableCell
                  align="center"
                  key={mealType}
                  className="text-muted-foreground font-semibold max-sm:px-1"
                >
                  {item[mealType] ? (
                    <GlucoseLogValue
                      mealType={mealType}
                      value={item[mealType]}
                      className="text-base sm:text-lg"
                      showSuffix={false}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InfiniteLoadingTrigger
        offset={offset}
        onChangeOffset={setOffset}
        totalSize={glucoseLogsByDayAndMealType.length}
        perLoad={ITEMS_PER_LOAD}
      />
    </div>
  );
}
