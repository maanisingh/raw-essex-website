const fs = require('fs');
const path = require('path');

console.log('🚀 Extracting product data from JavaScript meta objects...');

// Function to extract JSON data from HTML
function extractProductDataFromHTML(html) {
    const products = [];

    // Look for the meta object in script tags
    const metaMatch = html.match(/var meta = ({.*?"page":\s*{.*?}});/s);

    if (metaMatch) {
        try {
            const metaData = JSON.parse(metaMatch[1]);
            console.log(`Found meta data with ${metaData.products?.length || 0} products`);

            if (metaData.products) {
                metaData.products.forEach(product => {
                    // Extract main variant (usually the first one)
                    const variant = product.variants?.[0];
                    if (variant) {
                        const productData = {
                            name: variant.name,
                            price: variant.price / 100, // Convert from cents to pounds
                            vendor: product.vendor,
                            category: product.type,
                            id: product.id.toString(),
                            shopifyId: product.id,
                            variantId: variant.id,
                            sku: variant.sku || '',
                            status: 'in_stock'
                        };

                        products.push(productData);
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing meta data:', error.message);
        }
    }

    // Also look for analytics data which might have image URLs
    const analyticsMatch = html.match(/"collection_viewed",\s*({.*?})\]\]/s);
    if (analyticsMatch) {
        try {
            const analyticsData = JSON.parse(analyticsMatch[1]);
            const collection = analyticsData.collection;

            if (collection?.productVariants) {
                console.log(`Found analytics data with ${collection.productVariants.length} product variants`);

                collection.productVariants.forEach((variant, index) => {
                    if (products[index]) {
                        // Add image and URL data
                        products[index].image = variant.image?.src ?
                            (variant.image.src.startsWith('//') ? 'https:' + variant.image.src : variant.image.src) : '';
                        products[index].url = variant.product?.url ?
                            'https://www.rawessex.co.uk' + variant.product.url : '';
                        products[index].description = `${variant.product.title} - Premium quality pet food product from ${variant.product.vendor}`;

                        // Update category and brand based on analytics data
                        if (variant.product?.type) {
                            products[index].category = variant.product.type;
                        }

                        // Set brand based on vendor or product name
                        const nameLower = variant.product.title.toLowerCase();
                        if (nameLower.includes('we love raw')) {
                            products[index].brand = 'We Love Raw';
                        } else if (nameLower.includes('canagan')) {
                            products[index].brand = 'Canagan';
                        } else if (nameLower.includes('anco')) {
                            products[index].brand = 'Anco';
                        } else if (nameLower.includes('yora')) {
                            products[index].brand = 'Yora';
                        } else if (nameLower.includes('carnilove')) {
                            products[index].brand = 'Carnilove';
                        } else {
                            products[index].brand = variant.product.vendor || 'Raw Essex';
                        }

                        products[index].variations = ['Standard'];
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing analytics data:', error.message);
        }
    }

    return products;
}

// Process all downloaded pages
function extractAllProducts() {
    const allProducts = [];
    const seenIds = new Set();
    const pagesDir = '/tmp/raw-essex-pages';

    console.log('📂 Processing downloaded pages...');

    for (let page = 1; page <= 25; page++) {
        const filePath = path.join(pagesDir, `page-${page}.html`);

        if (fs.existsSync(filePath)) {
            console.log(`📄 Processing page ${page}...`);

            const html = fs.readFileSync(filePath, 'utf8');
            const products = extractProductDataFromHTML(html);

            console.log(`📊 Page ${page}: Found ${products.length} products`);

            // Add unique products based on shopifyId
            for (const product of products) {
                if (!seenIds.has(product.shopifyId)) {
                    seenIds.add(product.shopifyId);
                    product.id = allProducts.length + 1; // Sequential ID for our system
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
    const outputPath = path.join(__dirname, '../src/data/all-594-raw-essex-products.js');

    const fileContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Extracted from https://www.rawessex.co.uk/collections/all (all 25 pages)
// Generated on ${new Date().toISOString()}

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

// Get all unique image URLs for downloading
const getAllImageUrls = () => {
  return all594RawEssexProducts
    .map(product => product.image)
    .filter(url => url && url.length > 0);
};

module.exports = {
  products: all594RawEssexProducts,
  getProductsByCategory,
  getProductsByBrand,
  getInStockProducts,
  getProductsByPriceRange,
  getAllImageUrls,
  totalProducts: all594RawEssexProducts.length
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Saved ${products.length} products to ${outputPath}`);
}

// Main execution
function main() {
    try {
        console.log('🔍 Extracting all products from JavaScript data...');
        const products = extractAllProducts();

        console.log(`\n🎉 Successfully extracted ${products.length} products!`);

        // Save to file
        saveProductsToFile(products);

        // Print summary
        console.log('\n📊 SUMMARY:');
        console.log(`Total Products: ${products.length}`);

        const categories = {};
        const brands = {};
        const vendors = {};

        products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
            brands[product.brand] = (brands[product.brand] || 0) + 1;
            vendors[product.vendor] = (vendors[product.vendor] || 0) + 1;
        });

        console.log('\n📂 Products by Category:');
        Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} products`);
        });

        console.log('\n🏷️ Products by Brand:');
        Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
            console.log(`  ${brand}: ${count} products`);
        });

        console.log('\n🏪 Products by Vendor:');
        Object.entries(vendors).sort((a, b) => b[1] - a[1]).forEach(([vendor, count]) => {
            console.log(`  ${vendor}: ${count} products`);
        });

        // Count products with images
        const productsWithImages = products.filter(p => p.image && p.image.length > 0).length;
        console.log(`\n📸 Products with images: ${productsWithImages}/${products.length}`);

        console.log('\n✅ All products successfully extracted and saved!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();