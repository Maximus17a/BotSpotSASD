import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { query, queryOne } from '../utils/database';
import { createFormModal } from '../handlers/forms';
import { Form } from '../types';
import { createSuccessEmbed, createErrorEmbed } from '../utils/discord';

export const formCommand = {
  data: new SlashCommandBuilder()
    .setName('form')
    .setDescription('Gestionar formularios')
    .addSubcommand(subcommand =>
      subcommand
        .setName('submit')
        .setDescription('Enviar un formulario')
        .addIntegerOption(option =>
          option.setName('id')
            .setDescription('ID del formulario')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Ver todos los formularios disponibles')),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'submit') {
      const formId = interaction.options.getInteger('id', true);

      try {
        const form = await queryOne<Form>(
          'SELECT * FROM forms WHERE id = ? AND guildId = ?',
          [formId, interaction.guildId]
        );

        if (!form) {
          await interaction.reply({
            embeds: [createErrorEmbed('Error', 'Formulario no encontrado.')],
            ephemeral: true
          });
          return;
        }

        const modal = await createFormModal(form);
        await interaction.showModal(modal);
      } catch (error) {
        console.error('Error showing form:', error);
        await interaction.reply({
          embeds: [createErrorEmbed('Error', 'No se pudo mostrar el formulario.')],
          ephemeral: true
        });
      }
    } else if (subcommand === 'list') {
      try {
        const forms = await query<Form>(
          'SELECT * FROM forms WHERE guildId = ?',
          [interaction.guildId]
        );

        if (forms.length === 0) {
          await interaction.reply({
            content: 'No hay formularios disponibles.',
            ephemeral: true
          });
          return;
        }

        const formList = forms.map(f => 
          `**ID ${f.id}:** ${f.name}\n*${f.description || 'Sin descripción'}*`
        ).join('\n\n');

        const embed = createSuccessEmbed(
          'Formularios Disponibles',
          formList + '\n\nUsa `/form submit <id>` para enviar un formulario.'
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error('Error listing forms:', error);
        await interaction.reply({
          embeds: [createErrorEmbed('Error', 'No se pudieron listar los formularios.')],
          ephemeral: true
        });
      }
    }
  }
};
