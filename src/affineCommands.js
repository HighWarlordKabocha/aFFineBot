const { SlashCommandBuilder } = require('discord.js');
const affineService = require('./affineService');
const fs = require('fs');

// Load Pokémon list for validation
const pokemonList = fs.readFileSync('./src/wordlists/pokemon.txt', 'utf-8').split('\n').map(line => line.trim());
const colors = fs.readFileSync('./src/wordlists/color.txt', 'utf-8').split('\n').map(line => line.trim());
const adjectives = fs.readFileSync('./src/wordlists/adjective.txt', 'utf-8').split('\n').map(line => line.trim());
const animals = fs.readFileSync('./src/wordlists/animal.txt', 'utf-8').split('\n').map(line => line.trim());

module.exports = [
    // /affine-new command
    {
        data: new SlashCommandBuilder()
            .setName('affine-new')
            .setDescription('Starts a new cipher challenge!'),

        async execute(interaction) {
            const userId = interaction.user.id;

            // Generate random values for 'a' and 'b' for the affine cipher
            const a = affineService.getRandomA();
            const b = affineService.getRandomB();

            // Pick random words for the color, adjective, and animal
            const color = colors[Math.floor(Math.random() * colors.length)];
            const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const animal = animals[Math.floor(Math.random() * animals.length)];

            // Create the ciphered text
            const plainText = `${color}${adjective}${animal}`.toLowerCase();

            // Encrypt the plain text with the affine cipher
            const cipheredText = affineService.affineEncrypt(plainText, a, b);  // <-- Corrected to affineEncrypt

            // Store the challenge details for the user
            affineService.startChallenge(userId, a, b, cipheredText, plainText);

            return interaction.reply({
                content: `🔑 A new cipher challenge has been started! Try to guess the following ciphered text: **${cipheredText.toUpperCase()}**`,
                ephemeral: true
            });
        }
    },

    // /affine-guess command
    {
        data: new SlashCommandBuilder()
            .setName('affine-guess')
            .setDescription('Guess the ciphered text!')
            .addStringOption(option =>
                option.setName('guess')
                    .setDescription('Your guess for the ciphered text')
                    .setRequired(true)),

        async execute(interaction) {
            const userId = interaction.user.id;
            const guess = interaction.options.getString('guess').toLowerCase();

            // Retrieve user's affine cipher challenge
            const userChallenge = affineService.getChallenge(userId);

            if (!userChallenge) {
                return interaction.reply({ content: 'You do not have an active cipher challenge. Please start a new one with `/affine-new`.', ephemeral: true });
            }

            // Check if the guess is correct
            const decryptedText = affineService.affineDecrypt(userChallenge.cipheredText, userChallenge.a, userChallenge.b);  // <-- Corrected to affineDecrypt
            if (guess === decryptedText) {
                return interaction.reply({ content: `✅ Correct! The answer was **${decryptedText.toUpperCase()}**.`, ephemeral: true });
            }

            // If the guess is incorrect, increment attempts and check if they reached max attempts
            userChallenge.attempts++;
            if (userChallenge.attempts >= 3) {
                affineService.resetChallenge(userId); // Reset the challenge after 3 attempts
                return interaction.reply({ content: `❌ Incorrect guess. You have exceeded the maximum attempts. The correct answer was **${decryptedText.toUpperCase()}**. Your challenge has been reset.`, ephemeral: true });
            }

            // Inform the user of incorrect guess and remaining attempts
            return interaction.reply({ content: `❌ Incorrect guess. You have ${3 - userChallenge.attempts} attempt(s) left. Try again!`, ephemeral: true });
        }
    }
];
