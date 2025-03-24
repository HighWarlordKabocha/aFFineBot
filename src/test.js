const { generateAffineKeys } = require('./affineService');

for (let i = 0; i < 10; i++) {
    console.log(generateAffineKeys());
}
