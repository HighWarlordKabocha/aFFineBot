const fs = require('fs');
const path = require('path');

// Create a memory store for user challenges
const challenges = {};

// Function to read a wordlist and pick a random word
function getRandomWord(filePath) {
    try {
        const words = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(Boolean);
        return words.length > 0 ? words[Math.floor(Math.random() * words.length)] : null;
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

// Function to generate a random cipher challenge phrase
function generateRandomPhrase() {
    const wordlistsPath = path.join(__dirname, 'wordlists');

    const color = getRandomWord(path.join(wordlistsPath, 'color.txt'));
    const adjective = getRandomWord(path.join(wordlistsPath, 'adjective.txt'));
    const animal = getRandomWord(path.join(wordlistsPath, 'animal.txt'));

    if (!color || !adjective || !animal) {
        console.error('Error: One of the wordlists is empty or missing words.');
        return null;
    }

    return `${color}${adjective}${animal}`.toLowerCase();  // Example: "redswimmingcat"
}

// Affine cipher encryption logic
function affineEncrypt(text, a, b) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let encryptedText = '';

    // Handle uppercase letters
    text = text.toLowerCase();

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (alphabet.indexOf(char) !== -1) {
            const index = alphabet.indexOf(char);
            const encryptedIndex = (a * index + b) % 26;
            encryptedText += alphabet[encryptedIndex];
        } else {
            encryptedText += char; // Non-alphabetic characters remain unchanged
        }
    }
    return encryptedText.toUpperCase(); // Return as uppercase to match the format
}

// Affine cipher decryption logic
function affineDecrypt(ciphertext, a, b) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let decryptedText = '';
    
    // Calculate the modular inverse of 'a' mod 26
    const modInverse = (a, m) => {
        for (let i = 1; i < m; i++) {
            if ((a * i) % m === 1) return i;
        }
        return null; // Inverse doesn't exist
    };

    const aInv = modInverse(a, 26);
    if (aInv === null) {
        console.error("No modular inverse for 'a'. Decryption not possible.");
        return null;
    }

    // Decrypt the message
    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i].toLowerCase();
        if (alphabet.indexOf(char) !== -1) {
            const index = alphabet.indexOf(char);
            const decryptedIndex = (aInv * (index - b + 26)) % 26;
            decryptedText += alphabet[decryptedIndex];
        } else {
            decryptedText += char; // Non-alphabetic characters remain unchanged
        }
    }

    return decryptedText.toUpperCase(); // Return as uppercase to match the format
}

// Function to generate a random 'a' value for affine cipher
function getRandomA() {
    const aValues = [1, 3, 5, 7, 11, 15, 17, 19, 21, 23, 25]; // These are coprime with 26 (for mod 26)
    return aValues[Math.floor(Math.random() * aValues.length)];
}

// Function to generate a random 'b' value for affine cipher
function getRandomB() {
    return Math.floor(Math.random() * 26); // Random value between 0 and 25 for 'b'
}

// Start a new cipher challenge for a user
function startChallenge(userId, a, b, cipheredText, plainText) {
    challenges[userId] = {
        a,
        b,
        cipheredText,
        plainText,
        attempts: 0
    };
}

// Retrieve the challenge for a user
function getChallenge(userId) {
    return challenges[userId];
}

// Reset a user's challenge
function resetChallenge(userId) {
    delete challenges[userId];
}

module.exports = { 
    generateRandomPhrase, 
    affineEncrypt, 
    affineDecrypt, 
    getRandomA, 
    getRandomB,
    startChallenge,  // Export the startChallenge function
    getChallenge,    // Export the getChallenge function
    resetChallenge   // Export the resetChallenge function
};
