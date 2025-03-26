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

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

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

        if (subcommand === 'guess') {
            const guess = interaction.options.getString('guess');
            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply({
                    content: `You're still here? Go away! ... *They don't pay me enough to deal with this*... (or \`/affine new\` to try again).`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            if (guess.toLowerCase() === challenge.plainText) {
                affineService.resetChallenge(userId);
                return interaction.reply({
                    content: `You think my password is ${guess}? ... I suppose you *are* someone I'm supposed to be talking to. I was instructed to give you this passcode: R4di0_W4v3s`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            challenge.attempts++;

            if (challenge.attempts >= 2) {
                affineService.resetChallenge(userId);
                return interaction.reply({
                    content: `You think my password is ${guess}? Wrong! Now go away! (\`/affine new\` to try again).`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            return interaction.reply({
                content: `You think my password is ${guess}? Wrong! What a ridiculous password... Maybe you typo'ed, so I'll let you try one last time. *zzz*`,
                flags: [MessageFlags.Ephemeral]
            });
        }

        if (subcommand === 'cipher') {
            const text = interaction.options.getString('text');
            const challenge = affineService.getChallenge(userId);

            if (!challenge) {
                return interaction.reply({
                    content: 'You need to start this challenge with \`/affine new\`, first!',
                    flags: [MessageFlags.Ephemeral]
                });
            }

            if (challenge.cipheredUsed) {
                return interaction.reply({
                    content: `I've already ciphered a Pokémon name for this challenge. Use \`/affine guess\` to tell me my password.`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            if (!affineService.isValidPokemonName(text)) {
                return interaction.reply({
                    content: `"${text}" is no Pokémon name *I* recognize!`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            challenge.cipheredUsed = true;
            const cipheredText = affineService.affineEncrypt(text, challenge.a, challenge.b);
            return interaction.reply({
                content: `You have a ${text}? I'd call it a ${cipheredText}... *man, mod math makes me mad*... Now, use \`/affine guess\` to decipher my password: \`${cipheredText}\``,
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
