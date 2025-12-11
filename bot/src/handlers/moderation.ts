import { GuildMember, User } from 'discord.js';
import { query } from '../utils/database';

export async function addWarn(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string
): Promise<void> {
  await query(
    'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
    [guildId, userId, 'warn', reason, moderatorId]
  );

  // Check for auto-ban
  const warns = await query<any>(
    'SELECT COUNT(*) as count FROM userModerations WHERE guildId = ? AND userId = ? AND type = "warn"',
    [guildId, userId]
  );

  if (warns[0].count >= 3) {
    await addBan(guildId, userId, 'bot', 'Acumulación de 3 advertencias');
  }
}

export async function addBan(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string
): Promise<void> {
  await query(
    'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
    [guildId, userId, 'ban', reason, moderatorId]
  );
}

export async function addKick(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string
): Promise<void> {
  await query(
    'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
    [guildId, userId, 'kick', reason, moderatorId]
  );
}

export async function getUserWarns(guildId: string, userId: string): Promise<number> {
  const result = await query<any>(
    'SELECT COUNT(*) as count FROM userModerations WHERE guildId = ? AND userId = ? AND type = "warn"',
    [guildId, userId]
  );
  return result[0].count;
}

export async function getUserModerations(guildId: string, userId: string): Promise<any[]> {
  return await query(
    'SELECT * FROM userModerations WHERE guildId = ? AND userId = ? ORDER BY createdAt DESC',
    [guildId, userId]
  );
}
