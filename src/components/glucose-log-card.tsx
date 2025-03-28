'use client';

import { GlucoseLog } from '@prisma/client';
import { useState } from 'react';

import DeleteGlucoseLogButton from '@/components/delete-glucose-log-button';
import EditGlucoseLogButton from '@/components/edit-glucose-log-button';
import GlucoseLogMealTypeBadge from '@/components/glucose-log-meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log-value';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getDate, getFullDate, getHourMinute } from '@/utils/time';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogCard({ glucoseLog }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card onClick={() => setOpen(true)}>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2">
                <span className="text-xl">
                  {getHourMinute(glucoseLog.time)}
                </span>
                <span className="opacity-70">{getDate(glucoseLog.time)}</span>
              </div>
              <GlucoseLogMealTypeBadge glucoseLog={glucoseLog} />
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <GlucoseLogValue glucoseLog={glucoseLog} />
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between gap-10 pr-6">
              {getFullDate(glucoseLog.time)}
              <GlucoseLogMealTypeBadge glucoseLog={glucoseLog} />
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-3">
              <div className="flex w-full justify-center">
                <GlucoseLogValue glucoseLog={glucoseLog} />
              </div>
              <div>
                <p className="text-foreground">Comentários</p>
                <p>
                  {glucoseLog.notes || 'Nenhum comentário para este registro'}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-2">
          <EditGlucoseLogButton glucoseLog={glucoseLog} />
          <DeleteGlucoseLogButton glucoseLog={glucoseLog} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
