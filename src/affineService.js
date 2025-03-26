const fs = require('fs');
const path = require('path');

// In-memory storage for user challenges
let challenges = {};

// Function to get a random 'A' value for the affine cipher
// Returns a random integer between 1 and 25
function getRandomA() {
    return Math.floor(Math.random() * 25) + 1;
}

// Function to get a random 'B' value for the affine cipher
// Returns a random integer between 0 and 25
function getRandomB() {
    return Math.floor(Math.random() * 25);
}

// Function to load words from a file and return them as an array
// Accepts a filename and loads words from the corresponding file
// Each word is trimmed, converted to lowercase, and empty entries are removed
function loadWordlist(filename) {
    const filePath = path.join(__dirname, 'wordlists', filename);
    try {
        const words = fs.readFileSync(filePath, 'utf-8')
            .split(/\r?\n/)
            .map(word => word.trim().toLowerCase())
            .filter(Boolean);
        console.log(`Loaded ${words.length} words from ${filename}`);
        return words;
    } catch (error) {
        console.error(`Error loading wordlist ${filename}:`, error);
        return [];
    }
}

// Load wordlists for colors, verbs (used as adjectives), animals, and Pokémon names
const colors = loadWordlist('colors.txt');
const verbs = loadWordlist('verbs.txt'); // Using verbs in place of adjectives
const animals = loadWordlist('animals.txt');
const pokemonNames = loadWordlist('pokemon.txt');

// Function to generate a random phrase consisting of a color, verb, and animal
// Also adds 3 random letters to the phrase ensuring no duplicate letters
// Returns a random challenge phrase
function generateRandomPhrase() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];

    // Combine the color, verb, and animal into a phrase
    let phrase = `${color}${verb}${animal}`;

    // Identify already used letters in the phrase
    const usedLetters = new Set(phrase.toLowerCase().split('').filter(char => /[a-zA-Z]/.test(char)));

    // List of all available letters in the alphabet
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    // Filter out already used letters
    const availableLetters = alphabet.filter(letter => !usedLetters.has(letter));

    // Randomly select 3 new letters from the available ones
    const newLetters = [];
    for (let i = 0; i < 3; i++) {
        const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        newLetters.push(randomLetter);
        // Remove the letter from availableLetters to avoid duplicates
        availableLetters.splice(availableLetters.indexOf(randomLetter), 1);
    }

    // Inject the new letters into random positions in the phrase
    newLetters.forEach(letter => {
        const insertPos = Math.floor(Math.random() * (phrase.length + 1));
        phrase = phrase.slice(0, insertPos) + letter + phrase.slice(insertPos);
    });

    return phrase;
}

// Function to check if a word is a valid Pokémon name
// Accepts a word and returns true if it's a valid Pokémon name, false otherwise
function isValidPokemonName(word) {
    return pokemonNames.includes(word.toLowerCase());
}

// Affine cipher encryption function
// Accepts plainText, a, and b as input, and returns the ciphered text
function affineEncrypt(plainText, a, b) {
    let cipheredText = '';
    for (let i = 0; i < plainText.length; i++) {
        let char = plainText.charAt(i);
        if (/[a-zA-Z]/.test(char)) {
            let charCode = char.toLowerCase().charCodeAt(0) - 97;
            let cipheredCode = (a * charCode + b) % 26;
            cipheredText += String.fromCharCode(cipheredCode + 97);
        } else {
            cipheredText += char; // Keep non-alphabet characters unchanged
        }
    }
    return cipheredText;
}

// Function to start a challenge for a user
// Initializes a new challenge with random 'A' and 'B' values and a random phrase
// Stores the challenge in the challenges object
function startChallenge(userId, a, b, plainText) {
    const cipheredText = affineEncrypt(plainText, a, b);
    challenges[userId] = { a, b, cipheredText, plainText, attempts: 0, cipheredUsed: false };
}

// Function to retrieve the current challenge for a user
// Returns the challenge object for the given userId or undefined if no challenge exists
function getChallenge(userId) {
    return challenges[userId];
}

// Function to reset the challenge for a user
// Deletes the challenge data for the specified userId
function resetChallenge(userId) {
    delete challenges[userId];
}

// Export all necessary functions for use in other modules
module.exports = { 
    getRandomA, 
    getRandomB, 
    affineEncrypt, 
    startChallenge, 
    getChallenge, 
    resetChallenge, 
    isValidPokemonName, 
    generateRandomPhrase 
};
