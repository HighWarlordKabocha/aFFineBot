// functions to export
module.exports = {
    generateAffineKeys: () => {},
    encryptAffine: (text, a, b) => {},
    decryptAffine: (text, a, b) => {},
    isValidGuess: (guess, correct) => {}
};

// value 'a' has to be a coprime with 26 for an English alphabet
const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

// generates values for 'a' and 'b'
function generateAffineKeys() {
    const a = validAValues[Math.floor(Math.random() * validAValues.length)];
    const b = Math.floor(Math.random() * 26);
    return { a, b };
}

// ciphers a given text string
function encryptAffine(text, a, b) {
    return text
        .toUpperCase()
        .replace(/[A-Z]/g, (char) => {
            const x = char.charCodeAt(0) - 65; // Convert 'A'-'Z' to 0-25
            const encrypted = (a * x + b) % 26; // Apply affine formula
            return String.fromCharCode(encrypted + 65); // Convert back to letter
        });
}

const modInverseMap = {
    1: 1, 3: 9, 5: 21, 7: 15, 9: 3, 11: 19, 15: 7,
    17: 23, 19: 11, 21: 5, 23: 17, 25: 25
};

function modInverse(a) {
    return modInverseMap[a] || null; // Get inverse or return null (should never happen)
}

// decrypts text
function decryptAffine(text, a, b) {
	const aInv = modInverse(a);
	if (aInv === null) throw new Error("invalid A value!");
	
    return text
        .toUpperCase()
        .replace(/[A-Z]/g, (char) => {
            const y = char.charCodeAt(0) - 65; // Convert 'A'-'Z' to 0-25
            const decrypted = (aInv * (y - b + 26)) % 26; // Apply decryption formula
            return String.fromCharCode(decrypted + 65); // Convert back to letter
        });
}

// validates guess
function isValidGuess(guess, correct) {
    return guess.toUpperCase() === correct.toUpperCase();
}

const activeChallenges = {}; // Stores challenges per user

// generates challenge for user
function createChallenge(userId) {
    const { a, b } = generateAffineKeys();
    const wordList = ["COLOR", "ADJECTIVE", "ANIMAL"]; // Example categories
    const category = wordList[Math.floor(Math.random() * wordList.length)];
    const plaintext = "HELLO"; // Replace this with a random word from the selected list

    activeChallenges[userId] = {
        a,
        b,
        plaintext,
        attempts: 3
    };

    return encryptAffine(plaintext, a, b);
}

function getChallenge(userId) {
    return activeChallenges[userId] || null;
}

function clearChallenge(userId) {
    delete activeChallenges[userId];
}

module.exports = {
    generateAffineKeys,
    encryptAffine,
    decryptAffine,
    isValidGuess,
    createChallenge,
    getChallenge,
    clearChallenge
};


