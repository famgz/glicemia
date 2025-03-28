import LoginButton from '@/components/buttons/login';

interface Props {
  searchParams: {
    redirect?: string;
  };
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect } = searchParams;

  return (
    <div className="flex-center bg-muted flex-1">
      <div className="bg-background max-w-xl flex-1 rounded-lg">
        <div className="space-y-8 p-8 text-center shadow-lg">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">
              Bem-vindo ao Glicemia App
            </h1>
            <div className="space-y-2 text-gray-500">
              <p>Faça login na plataforma</p>
              <p>Conecte-se usando uma das formas de login abaixo</p>
            </div>
          </div>

          <div className="space-y-6">
            <LoginButton redirect={redirect} />
          </div>
        </div>
      </div>
    </div>
  );
}
