import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const guildId = searchParams.get('guild');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildId) {
      fetchConfig();
    }
  }, [guildId]);

  const fetchConfig = async () => {
    try {
      const response = await api.get(`/api/welcome/${guildId}`);
      setConfig(response.data);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.post(`/api/welcome/${guildId}`, config);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Bienvenida</h1>
          <p className="text-muted-foreground">
            Personaliza el mensaje de bienvenida para nuevos miembros
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mensaje de Bienvenida</CardTitle>
            <CardDescription>
              Variables disponibles: {'{user}'}, {'{server}'}, {'{memberCount}'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enabled">Estado</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={config?.enabled || false}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="enabled">Habilitado</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelId">ID del Canal</Label>
              <Input
                id="channelId"
                placeholder="123456789012345678"
                value={config?.channelId || ''}
                onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="¡Bienvenido {user} a {server}! Somos {memberCount} miembros."
                value={config?.message || ''}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
              <Input
                id="imageUrl"
                placeholder="https://ejemplo.com/imagen.png"
                value={config?.imageUrl || ''}
                onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
              />
            </div>

            <Button onClick={handleSave}>Guardar Configuración</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
