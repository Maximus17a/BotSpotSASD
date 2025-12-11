import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/dashboard');
    } else if (user) {
      navigate('/dashboard');
    }
  }, [user, searchParams, login, navigate]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-primary">BotSpotSASD</h1>
        <p className="text-xl text-muted-foreground">
          Panel de control para tu bot de Discord
        </p>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Gestiona automoderación, bienvenidas, roles y formularios con facilidad
          </p>
          <Button onClick={handleLogin} size="lg">
            Iniciar sesión con Discord
          </Button>
        </div>
      </div>
    </div>
  );
}
