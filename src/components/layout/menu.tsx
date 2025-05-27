import {
  ChartPieIcon,
  DropletsIcon,
  GlobeIcon,
  HomeIcon,
  LogInIcon,
  MenuIcon,
  SettingsIcon,
} from 'lucide-react';
import Link from 'next/link';

import { getLoggedInDBUser } from '@/actions/user';
import LogoutButton from '@/components/buttons/logout';
import { ModeToggleButton } from '@/components/buttons/mode-toggle-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function Menu() {
  const user = await getLoggedInDBUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48 p-2 text-sm" align={'end'}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Menu</span>
          <ModeToggleButton />
        </DropdownMenuLabel>

        {user ? (
          <>
            <DropdownMenuLabel className="flex items-center gap-4 p-3">
              <Avatar>
                <AvatarImage src={user.image || ''} alt="user avatar" />
                <AvatarFallback>
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={'/'} className="flex w-full items-center gap-2">
                <HomeIcon className="size-4" /> Home
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={'/logs'} className="flex w-full items-center gap-2">
                <DropletsIcon className="size-4" />
                Nova medição
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/user/${user.slug}`}
                className="flex w-full items-center gap-2"
              >
                <GlobeIcon className="size-4" />
                Histórico
                {!user.privateHistory && ' (público)'}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={'/reports'}
                className="flex w-full items-center gap-2"
              >
                <ChartPieIcon className="size-4" />
                Relatórios
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={'/settings'}
                className="flex w-full items-center gap-2"
              >
                <SettingsIcon className="size-4" />
                Configurações
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="mt-6" />
            <div>
              <LogoutButton />
            </div>
          </>
        ) : (
          <div className="flex w-full items-center justify-between gap-3 p-3">
            <span>Olá, faça seu login</span>

            <DropdownMenuItem asChild>
              <Button variant={'default'} className="h-8 px-3" asChild>
                <Link href={'/login'}>
                  <LogInIcon size={18} />
                </Link>
              </Button>
            </DropdownMenuItem>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
