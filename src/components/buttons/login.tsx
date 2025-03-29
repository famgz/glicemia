'use server';

import { login } from '@/actions/auth';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  redirect?: string;
  className?: string;
}

export default async function LoginButton({ redirect, className }: Props) {
  return (
    <form
      action={login}
      className={cn('flex items-center justify-between', className)}
    >
      <input type="hidden" name="redirect" value={redirect || ''} />
      <input type="hidden" name="login-provider" value="google" />
      <Button
        className="flex w-full items-center gap-2"
        variant={'outline'}
        type={'submit'}
      >
        <GoogleIcon className="size-4" />
        <span className="font-bold">
          Login com <span className="capitalize">Google</span>
        </span>
      </Button>
    </form>
  );
}
