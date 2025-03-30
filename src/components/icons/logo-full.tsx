import Logo from '@/components/icons/logo';

export default function LogoFull() {
  return (
    <div className="flex items-center gap-2">
      <Logo size={32} />
      <div className="flex flex-col font-semibold">
        <span className="leading-none">Diário de</span>
        <span className="leading-none">Glicemia</span>
      </div>
    </div>
  );
}
