'use server';

import { login } from '@/actions/auth';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';

interface Props {
  redirect?: string;
}

export default async function LoginButton({ redirect }: Props) {
  return (
    <form action={login} className="flex items-center justify-between">
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
