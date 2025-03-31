import Image from 'next/image';
import Link from 'next/link';

import heroImage from '@/assets/images/hero.png';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function Home() {
  return (
    <div className="flex-center expanded container flex-col">
      <div className="grid gap-6 md:grid-cols-2">
        {/* gretings */}
        <div className="space-y-12">
          <h1 className="text-foreground/80 text-3xl font-medium md:text-5xl">
            Registre sua{' '}
            <span className="text-foreground font-extrabold">glicemia</span>, e
            compartilhe seus{' '}
            <span className="text-foreground font-extrabold">resultados</span>!
          </h1>

          <div className="text-muted-foreground space-y-3 font-light md:text-xl">
            <p>
              Seja bem-vindo(a) ao{' '}
              <span className="text-primary font-bold">Diário de Glicemia</span>
              , sua plataforma para registrar medições de glicemia.
            </p>
            <p>
              Registre com precisão suas medições diárias, e compartilhe os
              resultados com seu médico.
            </p>
          </div>

          <Link
            href="/logs"
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'w-full max-w-[600px] text-lg font-bold md:text-xl'
            )}
          >
            Comece agora!
          </Link>
        </div>

        {/* hero image */}
        <div className="flex-center max-md:order-first">
          <Image
            src={heroImage}
            width={350}
            height={350}
            priority
            className="max-md:size-[300px]"
            alt="Aparelho medidor de glicemia ao lado de um dedo"
          />
        </div>
      </div>
    </div>
  );
}
