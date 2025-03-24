const { generateAffineKeys, encryptAffine } = require('./affineService');

const { a, b } = generateAffineKeys();
const plaintext = "HELLO";
const ciphertext = encryptAffine(plaintext, a, b);

console.log(`Affine Keys: A=${a}, B=${b}`);
console.log(`Plaintext: ${plaintext}`);
console.log(`Ciphertext: ${ciphertext}`);
