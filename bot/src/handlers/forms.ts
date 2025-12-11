import { 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ActionRowBuilder, 
  ModalSubmitInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { query, queryOne } from '../utils/database';
import { Form, FormField } from '../types';

export async function createFormModal(form: Form): Promise<ModalBuilder> {
  const modal = new ModalBuilder()
    .setCustomId(`form_${form.id}`)
    .setTitle(form.name);

  const fields = JSON.parse(form.fields as any) as FormField[];
  
  for (let i = 0; i < Math.min(fields.length, 5); i++) {
    const field = fields[i];
    const input = new TextInputBuilder()
      .setCustomId(`field_${i}`)
      .setLabel(field.name)
      .setStyle(field.type === 'text' ? TextInputStyle.Paragraph : TextInputStyle.Short)
      .setRequired(field.required);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    modal.addComponents(row);
  }

  return modal;
}

export async function handleFormSubmission(
  interaction: ModalSubmitInteraction,
  formId: number
): Promise<void> {
  try {
    const form = await queryOne<Form>(
      'SELECT * FROM forms WHERE id = ?',
      [formId]
    );

    if (!form) {
      await interaction.reply({ content: 'Formulario no encontrado.', ephemeral: true });
      return;
    }

    const fields = JSON.parse(form.fields as any) as FormField[];
    const data: Record<string, string> = {};

    for (let i = 0; i < fields.length; i++) {
      const value = interaction.fields.getTextInputValue(`field_${i}`);
      data[fields[i].name] = value;
    }

    await query(
      'INSERT INTO formSubmissions (formId, guildId, userId, data, status) VALUES (?, ?, ?, ?, ?)',
      [formId, interaction.guildId, interaction.user.id, JSON.stringify(data), 'pending']
    );

    await interaction.reply({
      content: '✅ Tu formulario ha sido enviado y está pendiente de revisión.',
      ephemeral: true
    });

    // Notify admins
    await notifyAdmins(interaction, form, data);
  } catch (error) {
    console.error('Error handling form submission:', error);
    await interaction.reply({
      content: 'Hubo un error al enviar el formulario.',
      ephemeral: true
    });
  }
}

async function notifyAdmins(
  interaction: ModalSubmitInteraction,
  form: Form,
  data: Record<string, string>
): Promise<void> {
  // Find a channel to send admin notifications (you may want to configure this)
  const guild = interaction.guild;
  if (!guild) return;

  const embed = new EmbedBuilder()
    .setTitle(`📋 Nuevo envío de formulario: ${form.name}`)
    .setDescription(`Usuario: <@${interaction.user.id}>`)
    .setColor('Blue')
    .setTimestamp();

  for (const [key, value] of Object.entries(data)) {
    embed.addFields({ name: key, value: value || 'N/A', inline: true });
  }

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`approve_submission_${form.id}`)
        .setLabel('Aprobar')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`reject_submission_${form.id}`)
        .setLabel('Rechazar')
        .setStyle(ButtonStyle.Danger)
    );

  // Send to the first channel the bot can access (you should configure this properly)
  const channel = guild.channels.cache.find(ch => ch.isTextBased());
  if (channel && channel.isTextBased()) {
    await channel.send({ embeds: [embed], components: [row] });
  }
}

export async function approveSubmission(
  submissionId: number,
  reviewerId: string
): Promise<void> {
  await query(
    'UPDATE formSubmissions SET status = ?, reviewedBy = ?, reviewedAt = NOW() WHERE id = ?',
    ['approved', reviewerId, submissionId]
  );
}

export async function rejectSubmission(
  submissionId: number,
  reviewerId: string
): Promise<void> {
  await query(
    'UPDATE formSubmissions SET status = ?, reviewedBy = ?, reviewedAt = NOW() WHERE id = ?',
    ['rejected', reviewerId, submissionId]
  );
}
