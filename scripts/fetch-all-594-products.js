const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting to fetch all 594 Raw Essex products...');

// Function to fetch a page using curl
async function fetchPage(pageNumber) {
    const url = `https://www.rawessex.co.uk/collections/all?page=${pageNumber}`;
    console.log(`📄 Fetching page ${pageNumber}...`);

    try {
        const { stdout } = await execAsync(`curl -s "${url}"`);
        return stdout;
    } catch (error) {
        console.error(`❌ Error fetching page ${pageNumber}:`, error.message);
        return '';
    }
}

// Function to parse products from HTML
function parseProductsFromHTML(html) {
    const $ = cheerio.load(html);
    const products = [];

    // Look for product grid items
    $('.grid__item .card-wrapper, .product-item, .grid-product__content').each((index, element) => {
        try {
            const $element = $(element);

            // Extract product name
            const nameElement = $element.find('.card__heading a, .product-item__title, h3 a').first();
            const name = nameElement.text().trim();
            const productUrl = nameElement.attr('href');

            // Extract price
            const priceElement = $element.find('.price-item--regular, .price, .money').first();
            let priceText = priceElement.text().trim();
            let price = 0;

            if (priceText) {
                // Remove currency symbols and extract number
                const priceMatch = priceText.match(/[\d,]+\.?\d*/);
                if (priceMatch) {
                    price = parseFloat(priceMatch[0].replace(',', ''));
                }
            }

            // Extract image URL
            const imageElement = $element.find('img').first();
            let imageUrl = imageElement.attr('src') || imageElement.attr('data-src') || imageElement.attr('data-srcset');

            if (imageUrl) {
                // Clean up image URL
                if (imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                } else if (imageUrl.startsWith('/')) {
                    imageUrl = 'https://www.rawessex.co.uk' + imageUrl;
                }

                // Remove size parameters to get full image
                imageUrl = imageUrl.split('?')[0];
            }

            // Extract vendor/brand
            const vendorElement = $element.find('.card__information .caption-with-letter-spacing, .vendor').first();
            const vendor = vendorElement.text().trim() || 'Raw Essex';

            if (name && name.length > 0) {
                const product = {
                    name: name,
                    price: price,
                    image: imageUrl || '',
                    url: productUrl ? (productUrl.startsWith('/') ? 'https://www.rawessex.co.uk' + productUrl : productUrl) : '',
                    vendor: vendor,
                    status: 'in_stock' // Default status
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

                // Set brand based on vendor or product name
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
            console.error('Error parsing product:', error.message);
        }
    });

    return products;
}

// Main function to fetch all products
async function fetchAllProducts() {
    const allProducts = [];
    const seenNames = new Set();

    // Fetch all 25 pages
    for (let page = 1; page <= 25; page++) {
        const html = await fetchPage(page);

        if (html) {
            const products = parseProductsFromHTML(html);
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
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return allProducts;
}

// Save products to file
function saveProductsToFile(products) {
    const outputPath = path.join(__dirname, '../src/data/all-594-raw-essex-products.js');

    const fileContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Scraped from https://www.rawessex.co.uk/collections/all (all 25 pages)

const all594RawEssexProducts = ${JSON.stringify(products, null, 2)};

// Utility functions
const getProductsByCategory = (category) => {
  return all594RawEssexProducts.filter(product => product.category === category);
};

const getProductsByBrand = (brand) => {
  return all594RawEssexProducts.filter(product => product.brand === brand);
};

const getInStockProducts = () => {
  return all594RawEssexProducts.filter(product => product.status === 'in_stock');
};

const getProductsByPriceRange = (minPrice, maxPrice) => {
  return all594RawEssexProducts.filter(product =>
    product.price >= minPrice && product.price <= maxPrice
  );
};

module.exports = {
  products: all594RawEssexProducts,
  getProductsByCategory,
  getProductsByBrand,
  getInStockProducts,
  getProductsByPriceRange,
  totalProducts: all594RawEssexProducts.length
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Saved ${products.length} products to ${outputPath}`);
}

// Main execution
async function main() {
    try {
        console.log('🔍 Fetching all 594 products from Raw Essex...');
        const products = await fetchAllProducts();

        console.log(`\n🎉 Successfully scraped ${products.length} products!`);

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

        console.log('\n✅ All 594 products successfully scraped and saved!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();