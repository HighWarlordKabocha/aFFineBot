const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Load command files dynamically
client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('Commands.js'));

for (const file of commandFiles) {
    const commands = require(path.join(__dirname, file)); // Now this should be an array of commands
    for (const command of commands) { // Iterate over each command in the array
        client.commands.set(command.data.name, command); // Set each command individually
    }
}

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ An error occurred while executing the command.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
