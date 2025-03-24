const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();  // Load environment variables from the .env file
const affineCommands = require('./affineCommands');  // Import your commands

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Initialize a collection for storing commands
client.commands = new Collection();

// Add the affine commands directly to the collection
client.commands.set(affineCommands.data.name, affineCommands);

client.once('ready', () => {
    console.log('Bot is ready!');
});

// Event for handling commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log in the bot with the token from the .env file
client.login(process.env.DISCORD_TOKEN);
