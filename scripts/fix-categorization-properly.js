const fs = require('fs');
const path = require('path');

console.log('🏷️ Fixing product categorization with proper logic...');

// Function to categorize a product with better logic
function categorizeProductProperly(product) {
    const name = product.name.toLowerCase();
    const originalType = (product.type || '').toLowerCase();
    const vendor = (product.vendor || '').toLowerCase();

    // Cat products first (most specific)
    if (name.includes('cat') || name.includes('kitten')) {
        if (name.includes('treat') || name.includes('bites')) {
            return {
                category: 'Cat Treats',
                image: '/images/placeholders/cat-treats.jpg'
            };
        } else if (name.includes('supplement') || name.includes('barf') || name.includes('lactol')) {
            return {
                category: 'Cat Supplements',
                image: '/images/placeholders/cat-supplements.jpg'
            };
        } else if (name.includes('dry') || name.includes('kibble') || name.includes('superfood')) {
            return {
                category: 'Cat Dry Food',
                image: '/images/placeholders/cat-dry-food.jpg'
            };
        } else if (name.includes('pouch') || name.includes('soup') || name.includes('wet')) {
            return {
                category: 'Cat Wet Food',
                image: '/images/placeholders/cat-wet-food.jpg'
            };
        } else if (name.includes('mince') || name.includes('complete') || name.includes('raw')) {
            return {
                category: 'Cat Raw Food',
                image: '/images/placeholders/cat-raw-food.jpg'
            };
        } else {
            return {
                category: 'Cat Products',
                image: '/images/placeholders/cat-treats.jpg'
            };
        }
    }

    // Bird food
    if (name.includes('bird') || name.includes('fat balls') || name.includes('sunflower') ||
        name.includes('seed') || name.includes('robin') || name.includes('songbird') ||
        name.includes('energy ball') || originalType.includes('bird')) {
        return {
            category: 'Bird Food',
            image: '/images/placeholders/bird-food.jpg'
        };
    }

    // Small animal food
    if (name.includes('rabbit') && !name.includes('dog') && !name.includes('mince') ||
        name.includes('guinea pig') || name.includes('small animal') ||
        name.includes('hay') || name.includes('norah')) {
        return {
            category: 'Small Animal Food',
            image: '/images/placeholders/small-animal-food.jpg'
        };
    }

    // Accessories
    if (name.includes('collar') || name.includes('harness') || name.includes('lead') ||
        name.includes('poo bag') || name.includes('holder') || name.includes('bundle')) {
        return {
            category: 'Accessories',
            image: '/images/placeholders/dog-accessories.jpg'
        };
    }

    // Toys
    if (name.includes('toy') || name.includes('ball') || name.includes('rope') ||
        name.includes('kong') || name.includes('flyer') || name.includes('bear') ||
        name.includes('blanket') || name.includes('nylabone')) {
        return {
            category: 'Toys',
            image: '/images/placeholders/pet-toys.jpg'
        };
    }

    // Feeding accessories
    if (name.includes('bowl') || name.includes('lick mat') || name.includes('mat')) {
        return {
            category: 'Bowl and Lick Mats',
            image: '/images/placeholders/feeding-bowls.jpg'
        };
    }

    // Bone Broths and Kefir
    if (name.includes('broth') || name.includes('kefir')) {
        return {
            category: 'Bone Broths',
            image: '/images/placeholders/bone-broth.jpg'
        };
    }

    // Supplements and health products
    if (name.includes('supplement') || name.includes('powder') || name.includes('oil') ||
        name.includes('blend') || name.includes('spray') || name.includes('cream') ||
        name.includes('drops') || name.includes('cleaner') || name.includes('tonic') ||
        name.includes('protect') || name.includes('immune') || name.includes('lotion') ||
        name.includes('shampoo') || name.includes('cologne') || name.includes('yeast') ||
        name.includes('probiotic') || name.includes('anal gland') || name.includes('boswellia') ||
        name.includes('mussel') || name.includes('psyllium') || name.includes('keeper') ||
        name.includes('lactol') || name.includes('liquid sheep') || name.includes('milk') ||
        name.includes('15c') || name.includes('30c')) {
        return {
            category: 'Dog Supplements',
            image: '/images/placeholders/dog-supplements.jpg'
        };
    }

    // Freeze dried treats
    if (name.includes('freeze') && name.includes('dried')) {
        return {
            category: 'Freeze Dried Raw Treats',
            image: '/images/placeholders/freeze-dried-treats.jpg'
        };
    }

    // Natural dog treats (chews, bones, etc.)
    if (name.includes('antler') || name.includes('horn') || name.includes('ear') ||
        name.includes('trachea') || name.includes('pizzle') || name.includes('paddywack') ||
        name.includes('testicles') || name.includes('knee') || name.includes('leg bone') ||
        name.includes('cartilage') || name.includes('collagen') || name.includes('braid') ||
        name.includes('skin') || name.includes('chew') || name.includes('bone') ||
        name.includes('foot') || name.includes('feet') || name.includes('neck') ||
        name.includes('snout') || name.includes('tube') || name.includes('grill') ||
        name.includes('hoof') || name.includes('marrow') || name.includes('blade')) {
        return {
            category: 'Natural Dog Treats',
            image: '/images/placeholders/dog-treats.jpg'
        };
    }

    // Processed dog treats
    if (name.includes('treat') || name.includes('training') || name.includes('jerky') ||
        name.includes('stick') && !name.includes('meaty stick') || name.includes('bar') ||
        name.includes('nibbles') || name.includes('bites') || name.includes('strips') ||
        name.includes('toppers') || name.includes('hearts') || name.includes('pate') ||
        name.includes('doughnut') || name.includes('sausage') || name.includes('twist') ||
        name.includes('roll') && !name.includes('skin roll') || name.includes('jerky')) {
        return {
            category: 'Dog Treats',
            image: '/images/placeholders/dog-treats.jpg'
        };
    }

    // Dry dog food
    if (name.includes('dry') || name.includes('kibble') || name.includes('cold pressed') ||
        name.includes('crunch') || name.includes('muesli') || name.includes('field and trial') ||
        originalType.includes('cold pressed')) {
        return {
            category: 'Dog Dry Food',
            image: '/images/placeholders/dog-dry-food.jpg'
        };
    }

    // Wet dog food
    if (name.includes('wet') || name.includes('pouch') || name.includes('can') ||
        name.includes('steamed')) {
        return {
            category: 'Dog Wet Food',
            image: '/images/placeholders/dog-wet-food.jpg'
        };
    }

    // Breeders and bulk
    if (name.includes('breeder') || name.includes('bulk') || name.includes('box deal') ||
        name.includes('10kg') || name.includes('20kg') || name.includes('x 10') ||
        name.includes('x 20')) {
        return {
            category: 'Breeders and Bulk',
            image: '/images/placeholders/bulk-food.jpg'
        };
    }

    // Raw dog food (this should be last for dogs to catch everything else)
    if (name.includes('mince') || name.includes('chunks') || name.includes('complete') ||
        name.includes('beef') || name.includes('lamb') || name.includes('chicken') ||
        name.includes('turkey') || name.includes('duck') || name.includes('venison') ||
        name.includes('rabbit') || name.includes('boar') || name.includes('tripe') ||
        name.includes('heart') || name.includes('liver') || name.includes('kidney') ||
        name.includes('spleen') || name.includes('muscle') || name.includes('lung') ||
        name.includes('alpaca') || name.includes('goat') || name.includes('veal') ||
        name.includes('ostrich') || name.includes('moose') || name.includes('fish') ||
        name.includes('oily fish') || originalType.includes('dog raw food')) {
        return {
            category: 'Dog Raw Food',
            image: '/images/placeholders/dog-raw-food.jpg'
        };
    }

    // Default fallback
    return {
        category: 'Pet Products',
        image: '/images/placeholders/pet-product.jpg'
    };
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
    console.log(`✅ Found ${products.length} products to re-categorize`);
} catch (error) {
    console.error('❌ Error parsing products array:', error.message);
    process.exit(1);
}

// Re-categorize all products
let categoryChanges = 0;
const categoryStats = {};
const brandStats = {};

products.forEach((product, index) => {
    const originalCategory = product.category;

    // Get proper categorization
    const newCategorization = categorizeProductProperly(product);

    // Update category if different
    if (product.category !== newCategorization.category) {
        product.category = newCategorization.category;
        product.image = newCategorization.image;
        categoryChanges++;
        console.log(`🏷️ Re-categorized "${product.name}": ${originalCategory} → ${newCategorization.category}`);
    }

    // Count stats
    categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    brandStats[product.brand] = (brandStats[product.brand] || 0) + 1;
});

console.log(`\n✅ RE-CATEGORIZATION COMPLETE:`);
console.log(`📝 Category changes: ${categoryChanges}`);

// Generate updated file content
const updatedContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Extracted from https://www.rawessex.co.uk/collections/all (all 25 pages)
// Generated on ${new Date().toISOString()}
// Updated with proper categorization and category-relevant placeholder images

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
console.log('\n📊 CORRECTED CATEGORY BREAKDOWN:');
Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
});

console.log('\n🏷️ BRAND BREAKDOWN:');
Object.entries(brandStats).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
});

console.log('\n✅ All products now have proper categorization and placeholder images!');