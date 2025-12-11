import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  PermissionFlagsBits,
  GuildMember
} from 'discord.js';
import { addWarn, addBan, addKick, getUserWarns, getUserModerations } from '../handlers/moderation';
import { createSuccessEmbed, createErrorEmbed } from '../utils/discord';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Advertir a un usuario')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario a advertir')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('razon')
      .setDescription('Razón de la advertencia')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('usuario', true);
  const reason = interaction.options.getString('razon', true);

  try {
    await addWarn(interaction.guildId!, user.id, interaction.user.id, reason);
    const warns = await getUserWarns(interaction.guildId!, user.id);

    const embed = createSuccessEmbed(
      'Usuario Advertido',
      `${user.tag} ha sido advertido.\n**Razón:** ${reason}\n**Total de advertencias:** ${warns}`
    );

    await interaction.reply({ embeds: [embed] });

    // Try to DM the user
    try {
      await user.send(`Has recibido una advertencia en **${interaction.guild?.name}**\n**Razón:** ${reason}`);
    } catch {
      // User has DMs disabled
    }
  } catch (error) {
    console.error('Error warning user:', error);
    await interaction.reply({
      embeds: [createErrorEmbed('Error', 'No se pudo advertir al usuario.')],
      ephemeral: true
    });
  }
}

export const banCommand = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear a un usuario')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('Razón del baneo')
        .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario', true);
    const reason = interaction.options.getString('razon', true);
    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'Usuario no encontrado en el servidor.')],
        ephemeral: true
      });
      return;
    }

    try {
      await addBan(interaction.guildId!, user.id, interaction.user.id, reason);
      await member.ban({ reason });

      const embed = createSuccessEmbed(
        'Usuario Baneado',
        `${user.tag} ha sido baneado.\n**Razón:** ${reason}`
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error banning user:', error);
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'No se pudo banear al usuario.')],
        ephemeral: true
      });
    }
  }
};

export const kickCommand = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsar a un usuario')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a expulsar')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('Razón de la expulsión')
        .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario', true);
    const reason = interaction.options.getString('razon', true);
    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'Usuario no encontrado en el servidor.')],
        ephemeral: true
      });
      return;
    }

    try {
      await addKick(interaction.guildId!, user.id, interaction.user.id, reason);
      await member.kick(reason);

      const embed = createSuccessEmbed(
        'Usuario Expulsado',
        `${user.tag} ha sido expulsado.\n**Razón:** ${reason}`
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error kicking user:', error);
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'No se pudo expulsar al usuario.')],
        ephemeral: true
      });
    }
  }
};

export const warnsCommand = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Ver las advertencias de un usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a consultar')
        .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario', true);

    try {
      const moderations = await getUserModerations(interaction.guildId!, user.id);
      const warns = moderations.filter(m => m.type === 'warn');

      if (warns.length === 0) {
        await interaction.reply({
          content: `${user.tag} no tiene advertencias.`,
          ephemeral: true
        });
        return;
      }

      const embed = createSuccessEmbed(
        `Advertencias de ${user.tag}`,
        `Total: ${warns.length} advertencias\n\n` +
        warns.map((w, i) => 
          `**${i + 1}.** ${w.reason}\n*<t:${Math.floor(new Date(w.createdAt).getTime() / 1000)}:R>*`
        ).join('\n\n')
      );

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Error fetching warns:', error);
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'No se pudieron obtener las advertencias.')],
        ephemeral: true
      });
    }
  }
};
