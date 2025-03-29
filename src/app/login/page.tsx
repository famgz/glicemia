import LoginButton from '@/components/buttons/login';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
interface Props {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const redirect = (await searchParams)?.redirect;

  return (
    <div className="bg-muted expanded flex-center">
      <Card className="w-full max-w-lg space-y-8 text-center">
        <CardHeader className="space-y-8">
          <CardTitle className="text-2xl">
            Bem-vindo ao Diário de Glicemia
          </CardTitle>
          <CardDescription className="space-y-2 text-lg text-gray-500">
            <p>Para acessar as funcionalidades, faça login na plataforma</p>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <LoginButton redirect={redirect} className="w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
