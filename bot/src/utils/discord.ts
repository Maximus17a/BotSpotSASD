import { EmbedBuilder, ColorResolvable } from 'discord.js';

export function createEmbed(
  title: string,
  description: string,
  color: ColorResolvable = 'Blue'
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return createEmbed(title, description, 'Green');
}

export function createErrorEmbed(title: string, description: string): EmbedBuilder {
  return createEmbed(title, description, 'Red');
}

export function createWarningEmbed(title: string, description: string): EmbedBuilder {
  return createEmbed(title, description, 'Yellow');
}

export function replaceVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}
