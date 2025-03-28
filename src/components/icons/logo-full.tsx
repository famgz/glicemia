import Logo from '@/components/icons/logo';

export default function LogoFull() {
  return (
    <div className="flex gap-2">
      <Logo size={36} />
      <div className="flex flex-col text-lg font-semibold opacity-70">
        <span className="leading-none">Glicemia</span>
        <span className="leading-none">App</span>
      </div>
    </div>
  );
}
