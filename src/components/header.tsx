import Link from 'next/link';

import Logo from '@/components/icons/logo';
import LogoFull from '@/components/icons/logo-full';
import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function Header() {
  return (
    <header>
      <Card className="rounded-t-none py-3">
        <CardContent className="container flex items-center justify-between py-1">
          <div className="flex items-center sm:gap-3">
            <Button variant={'ghost'} asChild className="p-0 px-2">
              <Link href={'/'} className="flex-center">
                <div className="desktop-only">
                  <LogoFull />
                </div>
                <div className="mobile-only">
                  <Logo />
                </div>
              </Link>
            </Button>
            <Button variant={'ghost'} asChild>
              <Link href={'/logs'} className="flex-center">
                Medições
              </Link>
            </Button>
          </div>
          <div className="flex-center gap-2.5">
            <Menu />
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
