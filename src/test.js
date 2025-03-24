const { generateAffineKeys, encryptAffine, decryptAffine, isValidGuess } = require('./affineService');

const { a, b } = generateAffineKeys();
const plaintext = "HELLO";
const ciphertext = encryptAffine(plaintext, a, b);
const decryptedText = decryptAffine(ciphertext, a, b);

// Simulated user guesses
const correctGuess = "HELLO";
const wrongGuess = "WORLD";

console.log(`Affine Keys: A=${a}, B=${b}`);
console.log(`Plaintext: ${plaintext}`);
console.log(`Ciphertext: ${ciphertext}`);
console.log(`Decrypted Text: ${decryptedText}`);

console.assert(decryptedText === plaintext, "❌ Decryption failed!");
console.assert(isValidGuess(correctGuess, plaintext), "❌ Guess validation failed!");
console.assert(!isValidGuess(wrongGuess, plaintext), "❌ Guess validation failed for incorrect input!");
console.log("✅ Guess validation test passed!");

const { generateRandomPhrase } = require('./affineService');
console.log('Generated Phrase:', generateRandomPhrase());
