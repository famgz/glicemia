import { PlusIcon } from 'lucide-react';

import UpsertGlucoseLogDialog from '@/components/glucose-log/upsert-glucose-log-dialog';
import { Button } from '@/components/ui/button';

export default function CreateGlucoseLogButton() {
  return (
    <UpsertGlucoseLogDialog>
      <Button className="gap-2 font-medium sm:text-lg">
        <PlusIcon strokeWidth={3} />
        <span>Nova medição</span>
      </Button>
    </UpsertGlucoseLogDialog>
  );
}
