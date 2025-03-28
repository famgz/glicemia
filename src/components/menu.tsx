import {
  BookMarkedIcon,
  HomeIcon,
  LogInIcon,
  MenuIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/auth';
import LogoutButton from '@/components/buttons/logout';
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
  const session = await auth();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48 p-2 text-sm" align={'end'}>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>

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
              <Link
                href={'/profile'}
                className="flex w-full items-center gap-2"
              >
                <UserIcon className="size-4" />
                Perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={'/profile'}
                className="flex w-full items-center gap-2"
              >
                <BookMarkedIcon className="size-4" />
                Relatórios
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
