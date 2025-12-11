import { Events, Interaction } from 'discord.js';
import { handleFormSubmission, approveSubmission, rejectSubmission } from '../handlers/forms';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      // Handle slash commands
      const command = (interaction.client as any).commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('Error executing command:', error);
        const reply = {
          content: 'Hubo un error al ejecutar este comando.',
          ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      }
    } else if (interaction.isModalSubmit()) {
      // Handle form submissions
      if (interaction.customId.startsWith('form_')) {
        const formId = parseInt(interaction.customId.split('_')[1]);
        await handleFormSubmission(interaction, formId);
      }
    } else if (interaction.isButton()) {
      // Handle button clicks
      if (interaction.customId.startsWith('approve_submission_')) {
        const submissionId = parseInt(interaction.customId.split('_')[2]);
        await approveSubmission(submissionId, interaction.user.id);
        await interaction.reply({ content: '✅ Envío aprobado.', ephemeral: true });
      } else if (interaction.customId.startsWith('reject_submission_')) {
        const submissionId = parseInt(interaction.customId.split('_')[2]);
        await rejectSubmission(submissionId, interaction.user.id);
        await interaction.reply({ content: '❌ Envío rechazado.', ephemeral: true });
      }
    }
  },
};
