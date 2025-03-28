import Link from 'next/link';

import { ModeToggleButton } from '@/components/buttons/mode-toggle-button';
import LogoFull from '@/components/icons/logo-full';
import Menu from '@/components/menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function Header() {
  return (
    <header>
      <Card className="rounded-t-none max-sm:py-3">
        <CardContent className="container flex items-center justify-between py-1">
          <div className="flex items-center">
            <Button variant={'ghost'} asChild>
              <Link href={'/'} className="flex-center">
                <LogoFull />
              </Link>
            </Button>
            <Button variant={'ghost'} asChild>
              <Link href={'/logs'} className="flex-center">
                Medições
              </Link>
            </Button>
          </div>

          <div className="flex-center gap-2.5">
            <ModeToggleButton />
            <Menu />
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
