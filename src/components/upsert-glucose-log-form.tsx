'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MealType } from '@prisma/client';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createGlucoseLogs } from '@/actions/glucose';
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

const mealTypeValues = Object.values(MealType) as [string, ...string[]];

const formSchema = z.object({
  value: z
    .union([
      z.number(),
      z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: 'Deve ser um número' }),
    ])
    .refine((val) => val <= 999, {
      message: 'Máximo de 999',
    }),
  mealType: z.enum(mealTypeValues),
  notes: z.string(),
});

interface Props {
  callbackFn?: () => void;
}

export function UpsertGlucoseLogForm({ callbackFn = () => {} }: Props) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { value, mealType, notes } = values;
      await createGlucoseLogs(value, mealType as MealType, notes);
      toast.success('Medição de glicemia criada com sucesso!');
      callbackFn();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o valor da medição"
                  {...field}
                  type="number"
                />
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de medição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(glucoseLogMap).map(([key, value]) => (
                      <SelectItem value={key} key={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Textarea placeholder="Adicione comentários" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
