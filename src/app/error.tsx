'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex-center container h-full w-full">
      <div className="flex-center max-sm:flex-col">
        <div className="flex flex-col items-center p-10 max-sm:border-b sm:border-r">
          <p className="text-4xl font-bold">500</p>
          <h1 className="text-center text-2xl font-light">Ocorreu um erro</h1>
        </div>
        <div className="flex h-full flex-col justify-between gap-12 p-10">
          <Button size={'lg'}>
            <Link href={'/'} className="text-lg !font-bold">
              Voltar para Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
