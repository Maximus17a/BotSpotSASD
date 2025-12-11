import { Message, GuildMember } from 'discord.js';
import { query, queryOne } from '../utils/database';
import { AutomodConfig } from '../types';

const userMessageCache = new Map<string, number[]>();

export async function handleAutomoderation(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  try {
    const config = await queryOne<AutomodConfig>(
      'SELECT * FROM automodConfigs WHERE guildId = ? AND enabled = TRUE',
      [message.guild.id]
    );

    if (!config) {
      return;
    }

    // Anti-spam check
    if (config.antiSpam && await isSpam(message)) {
      await message.delete();
      if (message.channel.isSendable()) {
        await message.channel.send(`${message.author}, por favor no hagas spam.`);
      }
      await addWarn(message.guild.id, message.author.id, 'bot', 'Spam detectado automáticamente');
      return;
    }

    // Banned words check
    if (config.bannedWords) {
      const bannedWords = Array.isArray(config.bannedWords) ? config.bannedWords : JSON.parse(config.bannedWords);
      const content = message.content.toLowerCase();
      const foundWord = bannedWords.find((word: string) => content.includes(word.toLowerCase()));
      
      if (foundWord) {
        await message.delete();
        if (message.channel.isSendable()) {
          await message.channel.send(`${message.author}, ese lenguaje no está permitido.`);
        }
        await addWarn(message.guild.id, message.author.id, 'bot', `Palabra prohibida: ${foundWord}`);
        return;
      }
    }

    // Banned links check
    if (config.bannedLinks) {
      const bannedLinks = Array.isArray(config.bannedLinks) ? config.bannedLinks : JSON.parse(config.bannedLinks);
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = message.content.match(urlRegex);
      
      if (urls) {
        for (const url of urls) {
          const foundLink = bannedLinks.find((link: string) => url.includes(link));
          if (foundLink) {
            await message.delete();
            if (message.channel.isSendable()) {
              await message.channel.send(`${message.author}, ese enlace no está permitido.`);
            }
            await addWarn(message.guild.id, message.author.id, 'bot', `Enlace prohibido: ${foundLink}`);
            return;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in handleAutomoderation:', error);
  }
}

async function isSpam(message: Message): Promise<boolean> {
  const key = `${message.guild!.id}-${message.author.id}`;
  const now = Date.now();
  const timestamps = userMessageCache.get(key) || [];
  
  // Keep only messages from last 5 seconds
  const recentTimestamps = timestamps.filter(t => now - t < 5000);
  recentTimestamps.push(now);
  
  userMessageCache.set(key, recentTimestamps);
  
  // If more than 5 messages in 5 seconds, it's spam
  return recentTimestamps.length > 5;
}

async function addWarn(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string
): Promise<void> {
  await query(
    'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
    [guildId, userId, 'warn', reason, moderatorId]
  );

  // Check if user has 3 or more warns
  const warns = await query<any>(
    'SELECT COUNT(*) as count FROM userModerations WHERE guildId = ? AND userId = ? AND type = "warn"',
    [guildId, userId]
  );

  if (warns[0].count >= 3) {
    // Auto-ban after 3 warns
    await query(
      'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
      [guildId, userId, 'ban', 'Acumulación de 3 advertencias', 'bot']
    );
  }
}
