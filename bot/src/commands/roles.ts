import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  PermissionFlagsBits,
  Role
} from 'discord.js';
import { query } from '../utils/database';
import { createSuccessEmbed, createErrorEmbed } from '../utils/discord';

export const addRoleCommand = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Gestionar roles de usuarios')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Asignar un rol a un usuario')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuario al que asignar el rol')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('rol')
            .setDescription('Rol a asignar')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Quitar un rol a un usuario')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuario al que quitar el rol')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('rol')
            .setDescription('Rol a quitar')
            .setRequired(true))),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('usuario', true);
    const role = interaction.options.getRole('rol', true) as Role;
    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'Usuario no encontrado en el servidor.')],
        ephemeral: true
      });
      return;
    }

    try {
      if (subcommand === 'add') {
        await member.roles.add(role);
        await query(
          'INSERT INTO userRoles (guildId, userId, roleId, assignedBy) VALUES (?, ?, ?, ?)',
          [interaction.guildId, user.id, role.id, interaction.user.id]
        );

        await interaction.reply({
          embeds: [createSuccessEmbed(
            'Rol Asignado',
            `Se ha asignado el rol ${role.name} a ${user.tag}`
          )]
        });
      } else if (subcommand === 'remove') {
        await member.roles.remove(role);

        await interaction.reply({
          embeds: [createSuccessEmbed(
            'Rol Removido',
            `Se ha quitado el rol ${role.name} a ${user.tag}`
          )]
        });
      }
    } catch (error) {
      console.error('Error managing role:', error);
      await interaction.reply({
        embeds: [createErrorEmbed('Error', 'No se pudo gestionar el rol.')],
        ephemeral: true
      });
    }
  }
};

export const rolesCommand = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Ver todos los roles disponibles'),

  async execute(interaction: ChatInputCommandInteraction) {
    const roles = interaction.guild?.roles.cache
      .filter(role => role.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(role => `${role.name}`)
      .join('\n');

    const embed = createSuccessEmbed(
      'Roles del Servidor',
      roles || 'No hay roles disponibles.'
    );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
