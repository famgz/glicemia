'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GlucoseLog, MealType } from '@prisma/client';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { getGlucoseLogsByLocalDay, upsertGlucoseLog } from '@/actions/glucose';
import { MealTypesLimitsInfo } from '@/components/buttons/meal-types-limits-info';
import DateTimePicker24h from '@/components/date-time-picker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { glucoseLogMap } from '@/constants/glucose-log';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  value: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((x) => !isNaN(Number(x)), { message: 'Deve ser um número' })
    .refine((x) => Number(x) < 1000, { message: 'Máximo de 999' }),
  mealType: z.string().min(1, 'Campo obrigatório'),
  notes: z.string().max(500, 'Máximo de 500 caracteres'),
  date: z.date({
    required_error: 'Campo obrigatório',
  }),
});

interface Props {
  glucoseLog?: GlucoseLog;
  callbackFn?: () => void;
}

export function UpsertGlucoseLogForm({
  glucoseLog,
  callbackFn = () => {},
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [markedMealTypesByDay, setMarkedMealTypesByDay] = useState<string[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: glucoseLog?.value?.toString() || '',
      mealType: glucoseLog?.mealType || '',
      notes: glucoseLog?.notes || '',
      date: glucoseLog?.date || new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { value, mealType, date, notes } = values;
      const res = await upsertGlucoseLog(
        glucoseLog?.id,
        Number(value),
        mealType as MealType,
        date,
        notes
      );
      if (res) {
        setTimeout(callbackFn, 300);
        toast.success('Medição registrada com sucesso!');
      } else {
        toast.error('Erro ao registrar medição');
      }
    });
  }

  const updateAvailableDayMealTypes = useCallback((date: Date | undefined) => {
    if (!date) {
      return;
    }
    startTransition(async () => {
      const res = await getGlucoseLogsByLocalDay(date);
      if (!res) {
        return;
      }
      const mealTypesByDay = Array.from(new Set(res.map((x) => x.mealType)));
      setMarkedMealTypesByDay(mealTypesByDay);
    });
  }, []);

  function handleDateChange(date: Date | undefined) {
    if (!date) {
      return;
    }
    updateAvailableDayMealTypes(date);
    form.setValue('mealType', '');
  }

  useEffect(() => {
    updateAvailableDayMealTypes(glucoseLog?.date || new Date());
  }, [glucoseLog?.date, updateAvailableDayMealTypes]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isPending} className="space-y-5">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="number"
                      className="!text-sm placeholder:!text-sm md:!text-sm"
                      placeholder="Digite o valor da medição"
                    />
                    <div className="flex-center bg-background absolute top-1/2 right-2 -translate-y-1/2 transform">
                      <MealTypesLimitsInfo />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mealType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo de medição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(glucoseLogMap).map(([key, value]) => {
                        const isUnavailable =
                          markedMealTypesByDay.includes(key);
                        return (
                          <SelectItem
                            value={key}
                            key={key}
                            disabled={isUnavailable}
                            className={cn({ 'line-through': isUnavailable })}
                          >
                            {value.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data e Hora</FormLabel>
                <FormControl>
                  <DateTimePicker24h
                    date={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date);
                      }
                    }}
                    onDateChange={(date) => {
                      if (date) {
                        handleDateChange(date);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="text-sm"
                    placeholder="Adicione comentários"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Salvar
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
