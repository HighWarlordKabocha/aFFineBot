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
                .setDescription('Cipher a Pokémon name.')
                .addStringOption(option =>
                    option.setName('text')
                        .setDescription('Pokémon name to cipher.')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

	if (subcommand === 'new') {
	    const a = affineService.getRandomA();
	    const b = affineService.getRandomB();
	    const plainText = affineService.generateRandomPhrase(); // Use the random phrase generator

	    console.log(`Generated phrase for user ${userId}: ${plainText}`);
	    affineService.startChallenge(userId, a, b, plainText);

	    return interaction.reply('A new cipher challenge has been started! Use `/affine cipher` to encrypt a Pokémon name.');
	}

        if (subcommand === 'guess') {
            const guess = interaction.options.getString('guess');
            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply('You don’t have an active challenge. Start a new one with `/affine new`.');
            }

            if (guess.toLowerCase() === challenge.plainText) {
                affineService.resetChallenge(userId);
                return interaction.reply('Correct! You have solved the challenge. The challenge has been reset.');
            }

            challenge.attempts++;

            if (challenge.attempts >= 2) {
                affineService.resetChallenge(userId);
                return interaction.reply(`Incorrect. You have exceeded the maximum attempts. The correct answer was **${challenge.plainText.toUpperCase()}**. Challenge reset.`);
            }

            return interaction.reply(`Incorrect. You have ${2 - challenge.attempts} attempt(s) left.`);
        }

        if (subcommand === 'cipher') {
            const text = interaction.options.getString('text');
            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply('You need to start a challenge first! Use `/affine new`.');
            }

            if (challenge.cipheredUsed) {
                return interaction.reply('You have already ciphered a Pokémon name for this challenge. Use `/affine guess` to solve the challenge.');
            }

            if (!affineService.isValidPokemonName(text)) {
                return interaction.reply(`"${text}" is not a valid Pokémon name.`);
            }

            challenge.cipheredUsed = true;
            const cipheredText = affineService.affineEncrypt(text, challenge.a, challenge.b);

            return interaction.reply(`The ciphered Pokémon name is: **${cipheredText}**. Now, use \`/affine guess\` to solve the challenge.`);
        }
    },
};
