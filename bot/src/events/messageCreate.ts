import { Events, Message } from 'discord.js';
import { handleAutomoderation } from '../handlers/automod';

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;
    await handleAutomoderation(message);
  },
};
