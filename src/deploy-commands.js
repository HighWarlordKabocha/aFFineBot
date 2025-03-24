require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? 'Loaded' : 'Not Loaded');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? process.env.CLIENT_ID : 'Not Loaded');
console.log('GUILD_ID:', process.env.GUILD_ID ? process.env.GUILD_ID : 'Not Loaded');

const commands = [];

// Dynamically load all command files
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('Commands.js'));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 Registering commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();
