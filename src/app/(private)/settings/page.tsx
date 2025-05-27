'use server';

import { notFound } from 'next/navigation';

import { getLoggedInDBUser } from '@/actions/user';
import ProfileSettingsForm from '@/app/(private)/settings/components/profile-settings-form';

export default async function SettingsPage() {
  const user = await getLoggedInDBUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="expanded container gap-8">
      <h1 className="text-xl font-semibold">Configurações</h1>
      <ProfileSettingsForm user={user} />
    </div>
  );
}
