const fs = require('fs');
const path = require('path');

console.log('🏷️ Fixing product categorization and adding placeholder images...');

// Define comprehensive category mapping based on product names and keywords
const categoryRules = [
    // Raw Dog Food
    {
        keywords: ['mince', 'chunks', 'complete', 'raw', 'beef', 'lamb', 'chicken', 'turkey', 'duck', 'venison', 'rabbit', 'boar', 'tripe', 'heart', 'muscle'],
        excludeKeywords: ['treat', 'chew', 'stick', 'jerky', 'training', 'supplement', 'powder', 'oil', 'collar', 'lead', 'harness', 'bowl', 'mat', 'toy'],
        category: 'Dog Raw Food',
        image: '/images/placeholders/dog-raw-food.jpg'
    },
    // Dog Dry Food
    {
        keywords: ['dry', 'kibble', 'grain free', 'cold pressed'],
        excludeKeywords: ['cat', 'kitten'],
        category: 'Dog Dry Food',
        image: '/images/placeholders/dog-dry-food.jpg'
    },
    // Dog Wet Food
    {
        keywords: ['wet', 'pouch', 'can'],
        excludeKeywords: ['cat', 'kitten'],
        category: 'Dog Wet Food',
        image: '/images/placeholders/dog-wet-food.jpg'
    },
    // Natural Dog Treats
    {
        keywords: ['antler', 'horn', 'ear', 'trachea', 'pizzle', 'paddywack', 'lung', 'testicles', 'knee', 'leg bone', 'cartilage', 'collagen', 'braid', 'skin', 'ribs'],
        excludeKeywords: ['cat'],
        category: 'Natural Dog Treats',
        image: '/images/placeholders/dog-treats.jpg'
    },
    // Dog Treats (processed)
    {
        keywords: ['treat', 'training', 'jerky', 'stick', 'bar', 'nibbles'],
        excludeKeywords: ['cat', 'kitten'],
        category: 'Dog Treats',
        image: '/images/placeholders/dog-treats.jpg'
    },
    // Dog Supplements
    {
        keywords: ['supplement', 'powder', 'oil', 'blend', 'topper', 'nutrient', 'vitamin', 'mineral', 'herb', 'boswellia', 'cranberry', 'anal gland'],
        excludeKeywords: ['cat', 'kitten'],
        category: 'Dog Supplements',
        image: '/images/placeholders/dog-supplements.jpg'
    },
    // Cat Raw Food
    {
        keywords: ['cat', 'kitten'],
        includeKeywords: ['mince', 'raw', 'complete'],
        category: 'Cat Raw Food',
        image: '/images/placeholders/cat-raw-food.jpg'
    },
    // Cat Wet Food
    {
        keywords: ['cat', 'kitten'],
        includeKeywords: ['wet', 'pouch', 'soup', 'pate'],
        category: 'Cat Wet Food',
        image: '/images/placeholders/cat-wet-food.jpg'
    },
    // Cat Dry Food
    {
        keywords: ['cat', 'kitten'],
        includeKeywords: ['dry', 'kibble', 'superfood'],
        category: 'Cat Dry Food',
        image: '/images/placeholders/cat-dry-food.jpg'
    },
    // Cat Treats
    {
        keywords: ['cat', 'kitten'],
        includeKeywords: ['treat', 'treat'],
        category: 'Cat Treats',
        image: '/images/placeholders/cat-treats.jpg'
    },
    // Cat Supplements
    {
        keywords: ['cat', 'kitten'],
        includeKeywords: ['supplement', 'barf', 'complete'],
        category: 'Cat Supplements',
        image: '/images/placeholders/cat-supplements.jpg'
    },
    // Accessories
    {
        keywords: ['collar', 'harness', 'lead', 'poo bag', 'holder'],
        category: 'Accessories',
        image: '/images/placeholders/dog-accessories.jpg'
    },
    // Toys
    {
        keywords: ['toy', 'play'],
        category: 'Toys',
        image: '/images/placeholders/pet-toys.jpg'
    },
    // Bone Broths
    {
        keywords: ['broth', 'kefir'],
        category: 'Bone Broths',
        image: '/images/placeholders/bone-broth.jpg'
    },
    // Bird Food
    {
        keywords: ['bird', 'fat balls', 'sunflower', 'seed'],
        category: 'Bird Food',
        image: '/images/placeholders/bird-food.jpg'
    },
    // Small Animal Food
    {
        keywords: ['rabbit', 'small animal'],
        excludeKeywords: ['dog', 'cat'],
        category: 'Small Animal Food',
        image: '/images/placeholders/small-animal-food.jpg'
    },
    // Breeders and Bulk
    {
        keywords: ['breeder', 'bulk', 'box deal', '10kg', '20kg'],
        category: 'Breeders and Bulk',
        image: '/images/placeholders/bulk-food.jpg'
    },
    // Feeding Accessories
    {
        keywords: ['bowl', 'lick mat', 'feeding'],
        category: 'Bowl and Lick Mats',
        image: '/images/placeholders/feeding-bowls.jpg'
    },
    // Freeze Dried
    {
        keywords: ['freeze dried', 'freeze-dried'],
        category: 'Freeze Dried Raw Treats',
        image: '/images/placeholders/freeze-dried-treats.jpg'
    },
    // Fish Treats
    {
        keywords: ['sprats', 'fish'],
        includeKeywords: ['treat'],
        category: 'Fish Treats',
        image: '/images/placeholders/fish-treats.jpg'
    }
];

// Function to categorize a product based on name, type, and vendor
function categorizeProduct(product) {
    const name = product.name.toLowerCase();
    const type = (product.type || '').toLowerCase();
    const vendor = (product.vendor || '').toLowerCase();
    const combined = `${name} ${type} ${vendor}`;

    // Find the best matching category rule
    for (const rule of categoryRules) {
        const hasKeyword = rule.keywords.some(keyword => combined.includes(keyword));
        const hasExcludeKeyword = rule.excludeKeywords ?
            rule.excludeKeywords.some(keyword => combined.includes(keyword)) : false;
        const hasIncludeKeyword = rule.includeKeywords ?
            rule.includeKeywords.some(keyword => combined.includes(keyword)) : true;

        if (hasKeyword && !hasExcludeKeyword && hasIncludeKeyword) {
            return {
                category: rule.category,
                image: rule.image
            };
        }
    }

    // Default categorization
    if (combined.includes('cat') || combined.includes('kitten')) {
        return {
            category: 'Cat Products',
            image: '/images/placeholders/cat-treats.jpg'
        };
    } else if (combined.includes('dog') || combined.includes('puppy')) {
        return {
            category: 'Dog Products',
            image: '/images/placeholders/dog-treats.jpg'
        };
    } else {
        return {
            category: 'Pet Products',
            image: '/images/placeholders/pet-product.jpg'
        };
    }
}

// Read the current products file
const productsPath = path.join(__dirname, '../src/data/all-594-raw-essex-products.js');
let content = fs.readFileSync(productsPath, 'utf8');

console.log('📖 Reading current products database...');

// Extract the products array
const productsMatch = content.match(/const all594RawEssexProducts = (\[[\s\S]*?\]);/);
if (!productsMatch) {
    console.error('❌ Could not find products array in file');
    process.exit(1);
}

let products;
try {
    products = JSON.parse(productsMatch[1]);
    console.log(`✅ Found ${products.length} products to process`);
} catch (error) {
    console.error('❌ Error parsing products array:', error.message);
    process.exit(1);
}

// Process all products
let categoryChanges = 0;
let imageAdditions = 0;
let brandUpdates = 0;
let descriptionUpdates = 0;

const categoryStats = {};
const brandStats = {};

products.forEach((product, index) => {
    const originalCategory = product.category;

    // Get better categorization
    const newCategorization = categorizeProduct(product);

    // Update category if different
    if (product.category !== newCategorization.category) {
        product.category = newCategorization.category;
        categoryChanges++;
        console.log(`🏷️ Updated category for "${product.name}": ${originalCategory} → ${newCategorization.category}`);
    }

    // Add image if missing
    if (!product.image || product.image === '') {
        product.image = newCategorization.image;
        imageAdditions++;
    }

    // Improve brand detection
    const nameLower = product.name.toLowerCase();
    let newBrand = product.brand;

    if (nameLower.includes('we love raw')) {
        newBrand = 'We Love Raw';
    } else if (nameLower.includes('canagan')) {
        newBrand = 'Canagan';
    } else if (nameLower.includes('anco')) {
        newBrand = 'Anco';
    } else if (nameLower.includes('yora')) {
        newBrand = 'Yora';
    } else if (nameLower.includes('carnilove')) {
        newBrand = 'Carnilove';
    } else if (nameLower.includes('antos')) {
        newBrand = 'Antos';
    } else if (nameLower.includes('birmingham') || nameLower.includes('bulmers')) {
        newBrand = 'Raw Essex';
    } else if (nameLower.includes('dougies')) {
        newBrand = 'Raw Essex';
    } else if (product.vendor === 'Dogs Butcher') {
        newBrand = 'Dogs Butcher';
    } else {
        newBrand = product.vendor || 'Raw Essex';
    }

    if (product.brand !== newBrand) {
        product.brand = newBrand;
        brandUpdates++;
    }

    // Improve description
    if (!product.description || product.description === '') {
        product.description = `${product.name} - Premium quality ${product.category.toLowerCase()} from ${product.brand}`;
        descriptionUpdates++;
    }

    // Add URL if missing
    if (!product.url || product.url === '') {
        const urlSlug = product.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        product.url = `https://www.rawessex.co.uk/products/${urlSlug}`;
    }

    // Add variations if missing
    if (!product.variations) {
        const sizeMatch = product.name.match(/(\d+\.?\d*\s*(kg|g|ml|l|x))/i);
        if (sizeMatch) {
            product.variations = [sizeMatch[1]];
        } else {
            product.variations = ['Standard'];
        }
    }

    // Count stats
    categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    brandStats[product.brand] = (brandStats[product.brand] || 0) + 1;
});

console.log(`\n✅ PROCESSING COMPLETE:`);
console.log(`📝 Category changes: ${categoryChanges}`);
console.log(`📸 Images added: ${imageAdditions}`);
console.log(`🏷️ Brand updates: ${brandUpdates}`);
console.log(`📄 Description updates: ${descriptionUpdates}`);

// Generate updated file content
const updatedContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Extracted from https://www.rawessex.co.uk/collections/all (all 25 pages)
// Generated on ${new Date().toISOString()}
// Updated with proper categorization and placeholder images

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

const getAllImageUrls = () => {
  return all594RawEssexProducts
    .map(product => product.image)
    .filter(url => url && url.length > 0);
};

const getProductsByVendor = (vendor) => {
  return all594RawEssexProducts.filter(product => product.vendor === vendor);
};

// Get category statistics
const getCategoryStats = () => {
  const stats = {};
  all594RawEssexProducts.forEach(product => {
    stats[product.category] = (stats[product.category] || 0) + 1;
  });
  return stats;
};

module.exports = {
  products: all594RawEssexProducts,
  getProductsByCategory,
  getProductsByBrand,
  getInStockProducts,
  getProductsByPriceRange,
  getAllImageUrls,
  getProductsByVendor,
  getCategoryStats,
  totalProducts: all594RawEssexProducts.length
};
`;

// Write updated file
fs.writeFileSync(productsPath, updatedContent);
console.log(`💾 Updated products database saved to ${productsPath}`);

// Print final statistics
console.log('\n📊 FINAL CATEGORY BREAKDOWN:');
Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
});

console.log('\n🏷️ FINAL BRAND BREAKDOWN:');
Object.entries(brandStats).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
});

console.log('\n✅ All products now have:');
console.log('   ✓ Proper categorization based on product names and types');
console.log('   ✓ Category-relevant placeholder images');
console.log('   ✓ Accurate brand assignment');
console.log('   ✓ Complete product descriptions');
console.log('   ✓ Product URLs and variations');
console.log('   ✓ Ready for admin panel editing!');