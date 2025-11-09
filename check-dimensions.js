const fs = require('fs');
const { createImageFromBuffer } = require('sharp');

async function checkDimensions(path) {
    try {
        const buffer = fs.readFileSync(path);
        const image = await createImageFromBuffer(buffer);
        const metadata = await image.metadata();
        console.log(`${path}: ${metadata.width}x${metadata.height}`);
    } catch (error) {
        console.error(`Error reading ${path}: ${error.message}`);
    }
}

Promise.all([
    checkDimensions('public/preview.png'),
    checkDimensions('public/splash.png'),
    checkDimensions('public/icon.png')
]);