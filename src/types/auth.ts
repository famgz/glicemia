import { User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      slug: string;
    };
  }
}

export interface SessionUser extends User {
  id: string;
  slug: string;
}
