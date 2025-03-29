'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GlucoseLog, MealType } from '@prisma/client';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { upsertGlucoseLog } from '@/actions/glucose';
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

const formSchema = z.object({
  value: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((x) => !isNaN(Number(x)), { message: 'Deve ser um número' })
    .refine((x) => Number(x) < 1000, { message: 'Máximo de 999' }),
  mealType: z.string().min(1, 'Campo obrigatório'),
  notes: z.string().max(500, 'Máximo de 500 caracteres'),
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: glucoseLog?.value?.toString() || '',
      mealType: glucoseLog?.mealType || '',
      notes: glucoseLog?.notes || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { value, mealType, notes } = values;
      const res = await upsertGlucoseLog(
        glucoseLog?.id,
        Number(value),
        mealType as MealType,
        notes
      );
      if (res) {
        callbackFn();
        toast.success('Medição registrada com sucesso!');
      } else {
        toast.error('Erro ao registrar medição');
      }
    });
  }

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
                      <SelectTrigger className="w-full">
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
        </fieldset>
      </form>
    </Form>
  );
}
