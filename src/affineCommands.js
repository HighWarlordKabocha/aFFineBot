const { SlashCommandBuilder } = require('discord.js');
const { createChallenge, getChallenge, clearChallenge, isValidGuess, encryptAffine } = require('./affineService');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('affine-new')
            .setDescription('Generates a new Affine cipher challenge'),
        
        async execute(interaction) {
            const userId = interaction.user.id;
            const encryptedText = createChallenge(userId);
    
            await interaction.reply(`Your new challenge: **${encryptedText}**`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('affine-guess')
            .setDescription('Submit a guess for your Affine cipher challenge')
            .addStringOption(option =>
                option.setName('text')
                    .setDescription('Your guessed plaintext')
                    .setRequired(true)),

        async execute(interaction) {
            const userId = interaction.user.id;
            const challenge = getChallenge(userId);

            if (!challenge) {
                await interaction.reply("❌ You don't have an active challenge! Use `/affine-new` to start one.");
                return;
            }

            const guess = interaction.options.getString('text');

            if (isValidGuess(guess, challenge.plaintext)) {
                clearChallenge(userId);
                await interaction.reply(`✅ Correct! The answer was **${challenge.plaintext}**.`);
            } else {
                challenge.attempts -= 1;

                if (challenge.attempts <= 0) {
                    clearChallenge(userId);
                    await interaction.reply(`❌ Out of attempts! The correct answer was **${challenge.plaintext}**.`);
                } else {
                    await interaction.reply(`❌ Incorrect! You have ${challenge.attempts} attempt(s) left.`);
                }
            }
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('affine-cipher')
            .setDescription('Encrypt a word using your current Affine cipher settings')
            .addStringOption(option =>
                option.setName('text')
                    .setDescription('Text to encrypt')
                    .setRequired(true)),

        async execute(interaction) {
            const userId = interaction.user.id;
            const challenge = getChallenge(userId);

            if (!challenge) {
                await interaction.reply("❌ You don't have an active challenge! Use `/affine-new` to start one.");
                return;
            }

            const text = interaction.options.getString('text');
            const cipheredText = encryptAffine(text, challenge.a, challenge.b);

            await interaction.reply(`🔐 Encrypted text: **${cipheredText}**`);
        }
    }
];
