const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download and process image
async function downloadImage(url, filename) {
    try {
        // Handle different URL formats
        let imageUrl = url;
        if (url.startsWith('//')) {
            imageUrl = 'https:' + url;
        } else if (!url.startsWith('http')) {
            imageUrl = 'https://rawessex.co.uk' + url;
        }

        console.log(`Downloading: ${imageUrl}`);

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.buffer();
        const outputPath = path.join(imagesDir, filename);

        // Process image with sharp to ensure consistent format and size
        await sharp(buffer)
            .resize(400, 400, {
                fit: 'cover',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .jpeg({ quality: 85 })
            .toFile(outputPath);

        console.log(`✅ Downloaded: ${filename}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to download ${filename}:`, error.message);

        // Create a placeholder image if download fails
        try {
            await sharp({
                create: {
                    width: 400,
                    height: 400,
                    channels: 3,
                    background: { r: 240, g: 240, b: 240 }
                }
            })
            .png()
            .composite([{
                input: Buffer.from(`<svg width="400" height="400">
                    <rect width="400" height="400" fill="#f0f0f0"/>
                    <text x="200" y="180" text-anchor="middle" font-size="16" fill="#999">Raw Essex</text>
                    <text x="200" y="220" text-anchor="middle" font-size="14" fill="#999">Product Image</text>
                </svg>`),
                top: 0,
                left: 0
            }])
            .toFile(path.join(imagesDir, filename));

            console.log(`📄 Created placeholder: ${filename}`);
        } catch (placeholderError) {
            console.error(`❌ Failed to create placeholder for ${filename}`);
        }
        return false;
    }
}

// Function to download all product images
async function downloadAllImages(products) {
    console.log(`🚀 Starting download of ${products.length} product images...`);

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.image) {
            const filename = `product${product.id}.jpg`;
            await downloadImage(product.image, filename);

            // Add small delay to be respectful to the server
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Progress indicator
        if ((i + 1) % 10 === 0) {
            console.log(`📊 Progress: ${i + 1}/${products.length} images processed`);
        }
    }

    console.log(`🎉 Completed downloading product images!`);
}

module.exports = { downloadImage, downloadAllImages };