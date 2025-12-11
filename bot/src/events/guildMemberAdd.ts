import { Events, GuildMember } from 'discord.js';
import { handleWelcome } from '../handlers/welcome';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    await handleWelcome(member);
  },
};
