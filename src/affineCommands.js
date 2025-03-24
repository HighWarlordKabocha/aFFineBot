const { SlashCommandBuilder } = require('discord.js');
const affineService = require('./affineService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('affine')
        .setDescription('Commands for the affine cipher.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('new')
                .setDescription('Start a new affine cipher challenge.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('guess')
                .setDescription('Guess the ciphered text.')
                .addStringOption(option =>
                    option.setName('guess')
                        .setDescription('Your guess for the ciphered text.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cipher')
                .setDescription('Cipher a given text.')
                .addStringOption(option =>
                    option.setName('text')
                        .setDescription('Text to be ciphered using the affine cipher.')
                        .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'new') {
            const a = affineService.getRandomA();
            const b = affineService.getRandomB();
            const plainText = affineService.generateRandomPhrase();
            const cipheredText = affineService.affineEncrypt(plainText, a, b);

            // Store the challenge for the user
            affineService.startChallenge(userId, a, b, cipheredText, plainText);

            return interaction.reply(`A new cipher challenge has been started! Try to guess the following ciphered text: **${cipheredText}**`);
        }

        if (subcommand === 'guess') {
            const guess = interaction.options.getString('guess');
            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply('You don\'t have an active challenge. Start a new one with `/affine new`.');
            }

            const { attempts, plainText } = challenge;

            // Check if the guess is correct
            if (guess.toLowerCase() === plainText) {
                affineService.resetChallenge(userId);
                return interaction.reply('Correct! You have solved the challenge. The challenge has been reset.');
            }

            // Incorrect guess
            const remainingAttempts = 2 - attempts;
            if (remainingAttempts > 0) {
                challenge.attempts++;
                return interaction.reply(`Incorrect guess. You have ${remainingAttempts} attempt(s) left. Try again!`);
            }

            // Max attempts reached
            affineService.resetChallenge(userId);
            return interaction.reply(`Incorrect guess. You have exceeded the maximum attempts. The correct answer was **${plainText.toUpperCase()}**. Your challenge has been reset.`);
        }

        if (subcommand === 'cipher') {
            const text = interaction.options.getString('text');

            // Cipher the provided text using a random a and b
            const a = affineService.getRandomA();
            const b = affineService.getRandomB();
            const cipheredText = affineService.affineEncrypt(text, a, b);

            return interaction.reply(`The ciphered text is: **${cipheredText}**`);
        }
    },
};
