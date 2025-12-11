import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Users, Shield, FileText } from 'lucide-react';

interface Guild {
  id: string;
  name: string;
  icon?: string;
}

export default function Dashboard() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuilds();
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      fetchStats();
    }
  }, [selectedGuild]);

  const fetchGuilds = async () => {
    try {
      const response = await api.get('/api/guilds');
      setGuilds(response.data);
      if (response.data.length > 0) {
        setSelectedGuild(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching guilds:', error);
    }
  };

  const fetchStats = async () => {
    if (!selectedGuild) return;
    try {
      const response = await api.get(`/api/moderation/${selectedGuild}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleGuildSelect = (guildId: string) => {
    setSelectedGuild(guildId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Gestiona tu servidor de Discord
          </p>
        </div>

        {/* Guild Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Selecciona un servidor</CardTitle>
            <CardDescription>
              Elige el servidor que deseas gestionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guilds.map((guild) => (
                <Button
                  key={guild.id}
                  variant={selectedGuild === guild.id ? 'default' : 'outline'}
                  className="h-auto py-4 justify-start"
                  onClick={() => handleGuildSelect(guild.id)}
                >
                  <Server className="h-5 w-5 mr-2" />
                  {guild.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {selectedGuild && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Advertencias
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.warns || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Baneos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bans || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Expulsiones
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.kicks || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formularios
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        {selectedGuild && (
          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>
                Configura las características de tu bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2"
                  onClick={() => navigate(`/welcome?guild=${selectedGuild}`)}
                >
                  <Shield className="h-6 w-6" />
                  <span>Configurar Bienvenida</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2"
                  onClick={() => navigate(`/automod?guild=${selectedGuild}`)}
                >
                  <Shield className="h-6 w-6" />
                  <span>Automoderación</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2"
                  onClick={() => navigate(`/roles?guild=${selectedGuild}`)}
                >
                  <Users className="h-6 w-6" />
                  <span>Gestionar Roles</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2"
                  onClick={() => navigate(`/forms?guild=${selectedGuild}`)}
                >
                  <FileText className="h-6 w-6" />
                  <span>Formularios</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2"
                  onClick={() => navigate(`/moderation?guild=${selectedGuild}`)}
                >
                  <Shield className="h-6 w-6" />
                  <span>Moderación</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2"
                  onClick={() => navigate(`/submissions?guild=${selectedGuild}`)}
                >
                  <FileText className="h-6 w-6" />
                  <span>Revisar Envíos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
