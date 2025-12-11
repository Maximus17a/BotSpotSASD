import { Client, Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`✅ Bot conectado como ${client.user?.tag}`);
    console.log(`🔧 Servidores activos: ${client.guilds.cache.size}`);
  },
};
