import 'dotenv/config';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';

// Extend Client type to include commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
  }
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

// Initialize commands collection
client.commands = new Collection();

// Load commands
async function loadCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    
    // Handle both default exports and named exports
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    }
    
    // Handle multiple commands in one file
    for (const key of Object.keys(command)) {
      const cmd = command[key];
      if (cmd && cmd.data && cmd.execute) {
        client.commands.set(cmd.data.name, cmd);
        commands.push(cmd.data.toJSON());
      }
    }
  }

  return commands;
}

// Load events
async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    const eventModule = event.default || event;

    if (eventModule.once) {
      client.once(eventModule.name, (...args) => eventModule.execute(...args));
    } else {
      client.on(eventModule.name, (...args) => eventModule.execute(...args));
    }
  }
}

// Register slash commands
async function registerCommands(commands: any[]) {
  const rest = new REST().setToken(config.token);

  try {
    console.log(`🔄 Registrando ${commands.length} comandos de aplicación...`);

    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );

    console.log(`✅ Comandos registrados exitosamente`);
  } catch (error) {
    console.error('Error registrando comandos:', error);
  }
}

// Initialize bot
async function main() {
  try {
    console.log('🚀 Iniciando BotSpotSASD...');

    // Load commands and events
    const commands = await loadCommands();
    await loadEvents();

    // Register commands
    await registerCommands(commands);

    // Login to Discord
    await client.login(config.token);
  } catch (error) {
    console.error('Error fatal al iniciar el bot:', error);
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
main();
