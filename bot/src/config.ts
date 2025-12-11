export interface BotConfig {
  token: string;
  clientId: string;
  clientSecret: string;
  databaseUrl: string;
  prefix: string;
  nodeEnv: string;
}

export const config: BotConfig = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.DISCORD_CLIENT_ID || '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  databaseUrl: process.env.DATABASE_URL || '',
  prefix: process.env.BOT_PREFIX || '!',
  nodeEnv: process.env.NODE_ENV || 'development',
};
