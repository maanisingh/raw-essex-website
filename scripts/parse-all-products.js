const fs = require('fs');
const path = require('path');

console.log('🚀 Parsing all downloaded product pages...');

// Simple HTML parser function
function extractProductsFromHTML(html) {
    const products = [];

    // Use regex to find product data patterns
    const productBlocks = html.match(/<div[^>]*class="[^"]*card-wrapper[^"]*"[^>]*>[\s\S]*?<\/div>/g) || [];

    productBlocks.forEach((block, index) => {
        try {
            // Extract product name
            const nameMatch = block.match(/<a[^>]*class="[^"]*card__heading[^"]*"[^>]*[^>]*>(.*?)<\/a>/s) ||
                             block.match(/<h3[^>]*class="[^"]*card__heading[^"]*"[^>]*>(.*?)<\/h3>/s) ||
                             block.match(/<a[^>]*href="\/products\/[^"]*"[^>]*>(.*?)<\/a>/s);

            if (!nameMatch) return;

            let name = nameMatch[1].replace(/<[^>]*>/g, '').trim();
            if (!name || name.length === 0) return;

            // Extract price
            const priceMatch = block.match(/<span[^>]*class="[^"]*price-item[^"]*"[^>]*>(.*?)<\/span>/s) ||
                              block.match(/<span[^>]*class="[^"]*money[^"]*"[^>]*>(.*?)<\/span>/s) ||
                              block.match(/£(\d+\.?\d*)/);

            let price = 0;
            if (priceMatch) {
                const priceText = priceMatch[1] ? priceMatch[1].replace(/<[^>]*>/g, '') : priceMatch[0];
                const priceNum = priceText.match(/[\d,]+\.?\d*/);
                if (priceNum) {
                    price = parseFloat(priceNum[0].replace(',', ''));
                }
            }

            // Extract image URL
            const imgMatch = block.match(/<img[^>]*src="([^"]*)"[^>]*>/s) ||
                            block.match(/<img[^>]*data-src="([^"]*)"[^>]*>/s);

            let imageUrl = '';
            if (imgMatch) {
                imageUrl = imgMatch[1];
                if (imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                } else if (imageUrl.startsWith('/')) {
                    imageUrl = 'https://www.rawessex.co.uk' + imageUrl;
                }
                // Remove size parameters
                imageUrl = imageUrl.split('?')[0];
            }

            // Extract product URL
            const urlMatch = block.match(/<a[^>]*href="(\/products\/[^"]*)"[^>]*>/s);
            let productUrl = '';
            if (urlMatch) {
                productUrl = 'https://www.rawessex.co.uk' + urlMatch[1];
            }

            // Extract vendor
            const vendorMatch = block.match(/<div[^>]*class="[^"]*caption-with-letter-spacing[^"]*"[^>]*>(.*?)<\/div>/s);
            let vendor = 'Raw Essex';
            if (vendorMatch) {
                vendor = vendorMatch[1].replace(/<[^>]*>/g, '').trim();
            }

            if (name && name.length > 0) {
                const product = {
                    name: name,
                    price: price,
                    image: imageUrl,
                    url: productUrl,
                    vendor: vendor,
                    status: 'in_stock'
                };

                // Categorize based on product name
                const nameLower = name.toLowerCase();
                if (nameLower.includes('cat')) {
                    if (nameLower.includes('treat')) {
                        product.category = 'Cat Treats';
                    } else if (nameLower.includes('dry') || nameLower.includes('kibble')) {
                        product.category = 'Cat Dry Food';
                    } else {
                        product.category = 'Cat Wet Food';
                    }
                } else if (nameLower.includes('bird')) {
                    product.category = 'Bird Food';
                } else if (nameLower.includes('liver') || nameLower.includes('kidney') || nameLower.includes('heart')) {
                    product.category = 'Organ Meats';
                } else if (nameLower.includes('treat') || nameLower.includes('chew') || nameLower.includes('stick')) {
                    product.category = 'Natural Dog Treats';
                } else if (nameLower.includes('collar') || nameLower.includes('lead') || nameLower.includes('harness')) {
                    product.category = 'Dog Accessories';
                } else if (nameLower.includes('supplement') || nameLower.includes('powder') || nameLower.includes('oil')) {
                    product.category = 'Dog Supplements';
                } else if (nameLower.includes('broth') || nameLower.includes('kefir')) {
                    product.category = 'Bone Broths';
                } else {
                    product.category = 'Dog Raw Food';
                }

                // Set brand
                if (nameLower.includes('we love raw')) {
                    product.brand = 'We Love Raw';
                } else if (nameLower.includes('canagan')) {
                    product.brand = 'Canagan';
                } else if (nameLower.includes('anco')) {
                    product.brand = 'Anco';
                } else if (nameLower.includes('yora')) {
                    product.brand = 'Yora';
                } else if (nameLower.includes('carnilove')) {
                    product.brand = 'Carnilove';
                } else {
                    product.brand = vendor || 'Raw Essex';
                }

                product.description = `${name} - Premium quality pet food product from ${product.brand}`;
                product.variations = ['Standard'];

                products.push(product);
            }
        } catch (error) {
            console.error(`Error parsing product in block ${index}:`, error.message);
        }
    });

    return products;
}

// Read all downloaded pages and parse products
function parseAllPages() {
    const allProducts = [];
    const seenNames = new Set();
    const pagesDir = '/tmp/raw-essex-pages';

    console.log('📂 Reading downloaded pages...');

    for (let page = 1; page <= 25; page++) {
        const filePath = path.join(pagesDir, `page-${page}.html`);

        if (fs.existsSync(filePath)) {
            console.log(`📄 Parsing page ${page}...`);

            const html = fs.readFileSync(filePath, 'utf8');
            const products = extractProductsFromHTML(html);

            console.log(`📊 Page ${page}: Found ${products.length} products`);

            // Add unique products
            for (const product of products) {
                if (!seenNames.has(product.name)) {
                    seenNames.add(product.name);
                    product.id = allProducts.length + 1;
                    allProducts.push(product);
                }
            }

            console.log(`📊 Total unique products so far: ${allProducts.length}`);
        } else {
            console.log(`⚠️ Page ${page} file not found: ${filePath}`);
        }
    }

    return allProducts;
}

// Save products to file
function saveProductsToFile(products) {
    const outputPath = path.join(__dirname, '../src/data/complete-594-raw-essex-products.js');

    const fileContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Scraped from https://www.rawessex.co.uk/collections/all (all 25 pages)
// Generated on ${new Date().toISOString()}

const complete594RawEssexProducts = ${JSON.stringify(products, null, 2)};

// Utility functions
const getProductsByCategory = (category) => {
  return complete594RawEssexProducts.filter(product => product.category === category);
};

const getProductsByBrand = (brand) => {
  return complete594RawEssexProducts.filter(product => product.brand === brand);
};

const getInStockProducts = () => {
  return complete594RawEssexProducts.filter(product => product.status === 'in_stock');
};

const getProductsByPriceRange = (minPrice, maxPrice) => {
  return complete594RawEssexProducts.filter(product =>
    product.price >= minPrice && product.price <= maxPrice
  );
};

// Get all unique image URLs for downloading
const getAllImageUrls = () => {
  return complete594RawEssexProducts
    .map(product => product.image)
    .filter(url => url && url.length > 0);
};

module.exports = {
  products: complete594RawEssexProducts,
  getProductsByCategory,
  getProductsByBrand,
  getInStockProducts,
  getProductsByPriceRange,
  getAllImageUrls,
  totalProducts: complete594RawEssexProducts.length
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Saved ${products.length} products to ${outputPath}`);
}

// Main execution
function main() {
    try {
        console.log('🔍 Parsing all 594 products from downloaded pages...');
        const products = parseAllPages();

        console.log(`\n🎉 Successfully parsed ${products.length} products!`);

        // Save to file
        saveProductsToFile(products);

        // Print summary
        console.log('\n📊 SUMMARY:');
        console.log(`Total Products: ${products.length}`);

        const categories = {};
        const brands = {};

        products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
            brands[product.brand] = (brands[product.brand] || 0) + 1;
        });

        console.log('\n📂 Products by Category:');
        Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} products`);
        });

        console.log('\n🏷️ Products by Brand:');
        Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
            console.log(`  ${brand}: ${count} products`);
        });

        // Count products with images
        const productsWithImages = products.filter(p => p.image && p.image.length > 0).length;
        console.log(`\n📸 Products with images: ${productsWithImages}/${products.length}`);

        console.log('\n✅ All products successfully parsed and saved!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();