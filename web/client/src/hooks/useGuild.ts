import { useEffect, useState } from 'react';
import api from '../lib/api';

export function useGuild(guildId: string | undefined) {
  const [guild, setGuild] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!guildId) {
      setIsLoading(false);
      return;
    }

    const fetchGuild = async () => {
      try {
        const response = await api.get(`/api/guilds/${guildId}`);
        setGuild(response.data);
      } catch (error) {
        console.error('Error fetching guild:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuild();
  }, [guildId]);

  return { guild, isLoading };
}
