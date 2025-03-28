import { LoaderCircleIcon } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex-center bg-background/20 size-full flex-1 flex-col gap-1">
      <LoaderCircleIcon className="text-muted-foreground size-12 animate-spin stroke-[2px]" />
      <span className="text-muted-foreground">Carregando...</span>
    </div>
  );
}
