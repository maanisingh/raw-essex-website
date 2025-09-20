const { downloadAllImages } = require('./download-images');
const rawEssexProducts = require('../src/data/raw-essex-products');

console.log('🚀 Starting Raw Essex Product Image Download...');
console.log(`📊 Found ${rawEssexProducts.length} products to process`);

downloadAllImages(rawEssexProducts)
  .then(() => {
    console.log('✅ Image download process completed!');
  })
  .catch((error) => {
    console.error('❌ Error during image download:', error);
  });