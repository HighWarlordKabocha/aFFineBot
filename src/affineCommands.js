const { SlashCommandBuilder, MessageFlags } = require('discord.js');
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

    // Handle the execution of commands based on the subcommand
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        // Handle the 'new' subcommand: start a new challenge
        if (subcommand === 'new') {
            const a = affineService.getRandomA();
            const b = affineService.getRandomB();
            const plainText = affineService.generateRandomPhrase();

            console.log(`Generated phrase for user ${userId}: ${plainText}`);
            affineService.startChallenge(userId, a, b, plainText);
            const cipheredText = affineService.affineEncrypt(plainText, a, b);
            return interaction.reply({
                content: `... What? Who's this? ... Umm, yeah, what affine day to *not* be part of an underground criminal organization, am I right? ... ... If you're someone I'm supposed to be talking to, you'll know how to decipher my password: \`${cipheredText}\`\n\nFirst, tell me a Pokemon name using \`/affine cipher <text>\`, and I'll cipher your Pokemon.\nYou'll know what to do with that. When you're ready, guess my Pokemon password using \`/affine guess <text>\`, and so long as you got it right, I'll know you're ok.\nFail, and you can bugger off (or \`/affine new\` to start over).\n*grumble, grumble*`,
                flags: [MessageFlags.Ephemeral]
            });
        }

        // Handle the 'guess' subcommand: process a guess for the ciphered text
        if (subcommand === 'guess') {
            const guess = interaction.options.getString('guess').toLowerCase();  // Convert guess to lowercase
            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply({
                    content: `You're still here? Go away! ... *They don't pay me enough to deal with this*... (or \`/affine new\` to try again).`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            // Compare the guess with the correct answer (ignoring case)
            if (guess === challenge.plainText.toLowerCase()) {  // Convert challenge plain text to lowercase
                affineService.resetChallenge(userId);
                return interaction.reply({
                    content: `You think my password is ${guess}? ... I suppose you *are* someone I'm supposed to be talking to. I was instructed to give you this passcode: R4di0_W4v3s`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            // Handle incorrect guesses and track attempts
            challenge.attempts++;

            if (challenge.attempts >= 2) {
                affineService.resetChallenge(userId);
                return interaction.reply({
                    content: `You think my password is ${guess}? Wrong! Now go away! (\`/affine new\` to try again).`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            return interaction.reply({
                content: `You think my password is ${guess}? Wrong again! Try again! (You have ${3 - challenge.attempts} tries left).`,
                flags: [MessageFlags.Ephemeral]
            });
        }

        // Handle the 'cipher' subcommand: cipher a Pokémon name
        if (subcommand === 'cipher') {
            const text = interaction.options.getString('text').toLowerCase();

            if (!affineService.isValidPokemonName(text)) {
                return interaction.reply({
                    content: `${text} is not a valid Pokémon name!`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply({
                    content: `You haven't started a challenge yet. Use \`/affine new\` to begin.`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            if (challenge.cipheredUsed) {
                return interaction.reply({
                    content: `You've already ciphered a Pokémon name. Try guessing the password or restart the challenge with \`/affine new\`.`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            // Cipher the Pokémon name for the user
            const cipheredText = affineService.affineEncrypt(text, challenge.a, challenge.b);
            challenge.cipheredUsed = true;
            return interaction.reply({
                content: `Your ciphered Pokémon name is: ${cipheredText}`,
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};
