const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive Raw Essex product scraping...');

// Base URL for Raw Essex collections
const baseUrl = 'https://www.rawessex.co.uk/collections/all';

// Function to scrape a single page
async function scrapePage(url) {
    console.log(`📄 Fetching page: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const products = [];

        // Find product containers (adjust selector based on actual HTML structure)
        $('.product-item, .grid-product, .product-card, [data-product-id]').each((index, element) => {
            try {
                const $element = $(element);

                // Extract product data
                const name = $element.find('.product-item__title, .product-title, h3, h2, a[href*="/products/"]').first().text().trim();
                const priceText = $element.find('.price, .product-price, .money, [data-price]').first().text().trim();
                const imageUrl = $element.find('img').first().attr('src') || $element.find('img').first().attr('data-src');
                const productUrl = $element.find('a[href*="/products/"]').first().attr('href');

                // Clean up price
                let price = 0;
                if (priceText) {
                    const priceMatch = priceText.match(/[\d,]+\.?\d*/);
                    if (priceMatch) {
                        price = parseFloat(priceMatch[0].replace(',', ''));
                    }
                }

                // Only add if we have essential data
                if (name && name.length > 0) {
                    const product = {
                        name: name,
                        price: price,
                        image: imageUrl ? (imageUrl.startsWith('//') ? 'https:' + imageUrl :
                               imageUrl.startsWith('/') ? 'https://www.rawessex.co.uk' + imageUrl : imageUrl) : '',
                        url: productUrl ? (productUrl.startsWith('/') ? 'https://www.rawessex.co.uk' + productUrl : productUrl) : '',
                        status: 'in_stock' // Default, can be updated based on stock indicators
                    };

                    products.push(product);
                    console.log(`  ✓ Found: ${name} - £${price}`);
                }
            } catch (error) {
                console.error(`❌ Error processing product element:`, error.message);
            }
        });

        return products;
    } catch (error) {
        console.error(`❌ Error fetching page ${url}:`, error.message);
        return [];
    }
}

// Function to find pagination links
async function findPaginationLinks(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const paginationLinks = [];

        // Look for pagination links
        $('a[href*="page="], .pagination a, .next, .previous').each((index, element) => {
            const href = $(element).attr('href');
            if (href && href.includes('page=')) {
                const fullUrl = href.startsWith('/') ? 'https://www.rawessex.co.uk' + href : href;
                if (!paginationLinks.includes(fullUrl)) {
                    paginationLinks.push(fullUrl);
                }
            }
        });

        // Also try URLs with page parameters manually
        for (let page = 1; page <= 20; page++) { // Try up to 20 pages
            const pageUrl = `${baseUrl}?page=${page}`;
            if (!paginationLinks.includes(pageUrl)) {
                paginationLinks.push(pageUrl);
            }
        }

        return paginationLinks;
    } catch (error) {
        console.error('Error finding pagination:', error.message);
        return [];
    }
}

// Function to scrape all products
async function scrapeAllProducts() {
    const allProducts = [];
    const processedUrls = new Set();

    console.log('🔍 Finding all pages...');

    // Start with the main page
    const mainPageProducts = await scrapePage(baseUrl);
    allProducts.push(...mainPageProducts);
    processedUrls.add(baseUrl);

    console.log(`📊 Found ${mainPageProducts.length} products on main page`);

    // Find pagination links
    const paginationLinks = await findPaginationLinks(baseUrl);
    console.log(`📄 Found ${paginationLinks.length} potential pagination URLs`);

    // Process each pagination link
    for (const pageUrl of paginationLinks) {
        if (!processedUrls.has(pageUrl)) {
            processedUrls.add(pageUrl);

            const pageProducts = await scrapePage(pageUrl);
            if (pageProducts.length > 0) {
                allProducts.push(...pageProducts);
                console.log(`📊 Total products so far: ${allProducts.length}`);

                // Add delay to be respectful
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.log(`📄 No products found on ${pageUrl}, might be end of pagination`);
            }
        }
    }

    // Remove duplicates based on name
    const uniqueProducts = [];
    const seenNames = new Set();

    for (const product of allProducts) {
        if (!seenNames.has(product.name)) {
            seenNames.add(product.name);
            product.id = uniqueProducts.length + 1;

            // Categorize products based on name
            const name = product.name.toLowerCase();
            if (name.includes('cat')) {
                product.category = name.includes('treat') ? 'Cat Treats' :
                                name.includes('dry') || name.includes('kibble') ? 'Cat Dry Food' : 'Cat Wet Food';
                product.brand = name.includes('canagan') ? 'Canagan' :
                              name.includes('carnilove') ? 'Carnilove' : 'Raw Essex';
            } else if (name.includes('bird') || name.includes('wild bird')) {
                product.category = 'Bird Food';
                product.brand = 'Raw Essex';
            } else if (name.includes('liver') || name.includes('kidney') || name.includes('heart')) {
                product.category = 'Organ Meats';
                product.brand = 'Raw Essex';
            } else if (name.includes('treat') || name.includes('chew') || name.includes('stick')) {
                product.category = 'Natural Dog Treats';
                product.brand = name.includes('anco') ? 'Anco' : 'Raw Essex';
            } else if (name.includes('collar') || name.includes('lead') || name.includes('harness')) {
                product.category = 'Dog Accessories';
                product.brand = 'Raw Essex';
            } else if (name.includes('supplement') || name.includes('powder') || name.includes('oil')) {
                product.category = 'Dog Supplements';
                product.brand = name.includes('canagan') ? 'Canagan' : 'Raw Essex';
            } else if (name.includes('broth') || name.includes('kefir')) {
                product.category = 'Bone Broths';
                product.brand = 'Raw Essex';
            } else {
                product.category = 'Dog Raw Food';
                product.brand = name.includes('we love raw') ? 'We Love Raw' :
                              name.includes('canagan') ? 'Canagan' :
                              name.includes('dougies') ? 'Raw Essex' :
                              name.includes('yora') ? 'Yora' : 'Raw Essex';
            }

            // Add description based on category and name
            product.description = `${product.name} - Premium quality pet food product`;

            // Add variations (simplified)
            product.variations = [product.name.includes('kg') ? product.name.match(/\d+\.?\d*kg/)?.[0] || 'Standard' : 'Standard'];

            uniqueProducts.push(product);
        }
    }

    console.log(`🎉 Scraping complete! Found ${uniqueProducts.length} unique products`);

    return uniqueProducts;
}

// Function to save products to file
function saveProductsToFile(products) {
    const outputPath = path.join(__dirname, '../src/data/all-raw-essex-products.js');

    const fileContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Scraped from https://www.rawessex.co.uk/collections/all

const allRawEssexProducts = ${JSON.stringify(products, null, 2)};

// Utility functions
const getProductsByCategory = (category) => {
  return allRawEssexProducts.filter(product => product.category === category);
};

const getProductsByBrand = (brand) => {
  return allRawEssexProducts.filter(product => product.brand === brand);
};

const getInStockProducts = () => {
  return allRawEssexProducts.filter(product => product.status === 'in_stock');
};

const getProductsByPriceRange = (minPrice, maxPrice) => {
  return allRawEssexProducts.filter(product =>
    product.price >= minPrice && product.price <= maxPrice
  );
};

module.exports = {
  products: allRawEssexProducts,
  getProductsByCategory,
  getProductsByBrand,
  getInStockProducts,
  getProductsByPriceRange,
  totalProducts: allRawEssexProducts.length
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Saved ${products.length} products to ${outputPath}`);
}

// Main execution
async function main() {
    try {
        const products = await scrapeAllProducts();
        saveProductsToFile(products);

        console.log('\n📊 SCRAPING SUMMARY:');
        console.log(`Total Products: ${products.length}`);

        // Count by category
        const categories = {};
        products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
        });

        console.log('\n📂 Products by Category:');
        Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} products`);
        });

        // Count by brand
        const brands = {};
        products.forEach(product => {
            brands[product.brand] = (brands[product.brand] || 0) + 1;
        });

        console.log('\n🏷️ Products by Brand:');
        Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
            console.log(`  ${brand}: ${count} products`);
        });

        console.log('\n✅ Scraping completed successfully!');

    } catch (error) {
        console.error('❌ Scraping failed:', error);
    }
}

// Run the script
main();