'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { isSlugAvailable, updateUserSettings } from '@/actions/user';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatSlug } from '@/utils/slug';

const unavailableUserMessage = 'Nome de usuário indisponível';

const formSchema = z.object({
  slug: z
    .string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(20, 'Máximo de 20 caracteres')
    .transform((x) => formatSlug(x)),
  privateHistory: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

interface Props {
  user: User;
}

export default function ProfileSettingsForm({ user }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privateHistory: user.privateHistory,
      slug: user.slug,
    },
    mode: 'onChange',
  });

  async function onSubmit(values: FormSchema) {
    const slug = values.slug;
    const isAvailable =
      slug === user.slug || (await isSlugAvailable(values.slug));
    if (!isAvailable) {
      form.setError('slug', {
        type: 'manual',
        message: unavailableUserMessage,
      });
      return;
    }
    console.log('Submitting:', values);
    const updatedUser = await updateUserSettings(values);
    if (!updatedUser) {
      toast.error('Erro ao atualizar configurações');
      return;
    }
    toast.success('Usuário atualizado com sucesso');
    console.log(updatedUser);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg space-y-8"
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuário</FormLabel>
              <div className="flex flex-wrap items-center gap-3">
                <FormControl>
                  <Input {...field} maxLength={20} className="flex-1" />
                </FormControl>
                <div className="flex items-center gap-3">
                  <ArrowRightIcon className="text-muted-foreground shrink-0" />
                  <p className="text-muted-foreground max-w-1/2 whitespace-nowrap">
                    {'/ '}
                    {formatSlug(field.value)}
                  </p>
                </div>
              </div>
              <FormMessage />
              <FormDescription className="text-xs">
                Nome utilizado no link da sua{' '}
                <Link
                  href={`/user/${user.slug}`}
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'h-fit p-0'
                  )}
                >
                  página de histórico
                </Link>
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="privateHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Página de histórico</FormLabel>
              <div className="mt-1 flex flex-col gap-2">
                <div className="flex gap-2">
                  <FormControl>
                    <Checkbox
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm !font-normal">
                    Link privado
                  </FormLabel>
                </div>
                <div className="space-y-1 leading-none">
                  <FormDescription className="text-xs">
                    O link ficará apenas disponível para você
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="min-w-32"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? 'Salvando' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
