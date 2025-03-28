import { ModeToggleButton } from '@/components/buttons/mode-toggle-button';

export default function Home() {
  return (
    <div className="expanded p-10">
      <div className="self-end">
        <ModeToggleButton />
      </div>
      <div className="expanded flex-center">
        <h1 className="text-xl">Hello World</h1>
      </div>
    </div>
  );
}
