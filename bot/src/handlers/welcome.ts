import { GuildMember, TextChannel } from 'discord.js';
import { query, queryOne } from '../utils/database';
import { WelcomeConfig } from '../types';
import { replaceVariables } from '../utils/discord';

export async function handleWelcome(member: GuildMember): Promise<void> {
  try {
    const config = await queryOne<WelcomeConfig>(
      'SELECT * FROM welcomeConfigs WHERE guildId = ? AND enabled = TRUE',
      [member.guild.id]
    );

    if (!config || !config.channelId || !config.message) {
      return;
    }

    const channel = member.guild.channels.cache.get(config.channelId) as TextChannel;
    if (!channel) {
      return;
    }

    const message = replaceVariables(config.message, {
      user: `<@${member.id}>`,
      server: member.guild.name,
      memberCount: member.guild.memberCount.toString(),
    });

    await channel.send({
      content: message,
      ...(config.imageUrl && {
        embeds: [{
          image: { url: config.imageUrl },
        }],
      }),
    });

    // Auto-assign roles if configured
    const roleConfigs = await query<any>(
      'SELECT roleId FROM roleConfigs WHERE guildId = ? AND autoAssign = TRUE',
      [member.guild.id]
    );

    for (const roleConfig of roleConfigs) {
      const role = member.guild.roles.cache.get(roleConfig.roleId);
      if (role) {
        await member.roles.add(role);
        await query(
          'INSERT INTO userRoles (guildId, userId, roleId, assignedBy) VALUES (?, ?, ?, ?)',
          [member.guild.id, member.id, roleConfig.roleId, 'bot']
        );
      }
    }
  } catch (error) {
    console.error('Error in handleWelcome:', error);
  }
}
