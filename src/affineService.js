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

module.exports = {
    generateAffineKeys,
    encryptAffine: (text, a, b) => {},
    decryptAffine: (text, a, b) => {},
    isValidGuess: (guess, correct) => {}
};
