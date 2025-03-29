import Logo from '@/components/icons/logo';

export default function LogoFull() {
  return (
    <div className="flex gap-2">
      <Logo size={32} />
      <div className="flex flex-col font-semibold opacity-70">
        <span className="leading-none">Diário de</span>
        <span className="leading-none">Glicemia</span>
      </div>
    </div>
  );
}
