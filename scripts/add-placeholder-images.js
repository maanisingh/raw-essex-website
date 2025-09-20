const fs = require('fs');
const path = require('path');

console.log('🖼️ Adding category-relevant placeholder images to all 594 products...');

// Define placeholder images for each category
const categoryPlaceholders = {
  'Dog Raw Food': '/images/placeholders/dog-raw-food.jpg',
  'Natural Dog Treats': '/images/placeholders/dog-treats.jpg',
  'Dog Supplements': '/images/placeholders/dog-supplements.jpg',
  'Dog Treats': '/images/placeholders/dog-treats.jpg',
  'Accessories': '/images/placeholders/dog-accessories.jpg',
  'Cat Wet Food': '/images/placeholders/cat-wet-food.jpg',
  'Cat Dry Food': '/images/placeholders/cat-dry-food.jpg',
  'Cat Treats': '/images/placeholders/cat-treats.jpg',
  'Cat Supplements': '/images/placeholders/cat-supplements.jpg',
  'Cat Raw Food': '/images/placeholders/cat-raw-food.jpg',
  'Dog Dry Food': '/images/placeholders/dog-dry-food.jpg',
  'Dog Wet Food': '/images/placeholders/dog-wet-food.jpg',
  'Bone Broths': '/images/placeholders/bone-broth.jpg',
  'bird feed': '/images/placeholders/bird-food.jpg',
  'Small Animal Food': '/images/placeholders/small-animal-food.jpg',
  'Toys': '/images/placeholders/pet-toys.jpg',
  'Breeders and Bulk': '/images/placeholders/bulk-food.jpg',
  'cold pressed': '/images/placeholders/cold-pressed-food.jpg',
  'freeze dried raw treats': '/images/placeholders/freeze-dried-treats.jpg',
  'Bowl and Lick Mats': '/images/placeholders/feeding-bowls.jpg',
  'sprats': '/images/placeholders/fish-treats.jpg'
};

// Default placeholder for unknown categories
const defaultPlaceholder = '/images/placeholders/pet-product.jpg';

// Read the current products file
const productsPath = path.join(__dirname, '../src/data/all-594-raw-essex-products.js');
let content = fs.readFileSync(productsPath, 'utf8');

console.log('📖 Reading current products database...');

// Extract the products array using regex
const productsMatch = content.match(/const all594RawEssexProducts = (\[[\s\S]*?\]);/);
if (!productsMatch) {
  console.error('❌ Could not find products array in file');
  process.exit(1);
}

let products;
try {
  // Parse the products array
  products = JSON.parse(productsMatch[1]);
  console.log(`✅ Found ${products.length} products to update`);
} catch (error) {
  console.error('❌ Error parsing products array:', error.message);
  process.exit(1);
}

// Add placeholder images and enhance product data
let updatedCount = 0;
const categoryStats = {};

products.forEach(product => {
  // Get appropriate placeholder image for category
  const placeholder = categoryPlaceholders[product.category] || defaultPlaceholder;

  // Add image if not present or empty
  if (!product.image || product.image === '') {
    product.image = placeholder;
    updatedCount++;
  }

  // Add description if missing
  if (!product.description) {
    product.description = `${product.name} - Premium quality ${product.category.toLowerCase()} from ${product.vendor || 'Raw Essex'}`;
  }

  // Add URL if missing
  if (!product.url) {
    const urlSlug = product.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    product.url = `https://www.rawessex.co.uk/products/${urlSlug}`;
  }

  // Add brand if missing
  if (!product.brand) {
    const nameLower = product.name.toLowerCase();
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
    } else if (nameLower.includes('antos')) {
      product.brand = 'Antos';
    } else if (nameLower.includes('dougies') || nameLower.includes('birmingham')) {
      product.brand = 'Raw Essex';
    } else {
      product.brand = product.vendor || 'Raw Essex';
    }
  }

  // Add variations if missing
  if (!product.variations) {
    // Try to extract size/weight from name
    const sizeMatch = product.name.match(/(\d+\.?\d*\s*(kg|g|ml|l|x))/i);
    if (sizeMatch) {
      product.variations = [sizeMatch[1]];
    } else {
      product.variations = ['Standard'];
    }
  }

  // Count categories for stats
  categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
});

console.log(`✅ Updated ${updatedCount} products with placeholder images`);

// Generate updated file content
const updatedContent = `// Complete Raw Essex Product Catalog - ${products.length} Products
// Extracted from https://www.rawessex.co.uk/collections/all (all 25 pages)
// Generated on ${new Date().toISOString()}
// Updated with category-relevant placeholder images

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

// Get products by vendor
const getProductsByVendor = (vendor) => {
  return all594RawEssexProducts.filter(product => product.vendor === vendor);
};

module.exports = {
  products: all594RawEssexProducts,
  getProductsByCategory,
  getProductsByBrand,
  getInStockProducts,
  getProductsByPriceRange,
  getAllImageUrls,
  getProductsByVendor,
  totalProducts: all594RawEssexProducts.length
};
`;

// Write updated file
fs.writeFileSync(productsPath, updatedContent);
console.log(`💾 Updated products database saved to ${productsPath}`);

// Print category breakdown and placeholder assignments
console.log('\n📊 CATEGORY BREAKDOWN WITH PLACEHOLDER IMAGES:');
Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
  const placeholder = categoryPlaceholders[category] || defaultPlaceholder;
  console.log(`  ${category}: ${count} products → ${placeholder}`);
});

// Count products with different brands
const brandStats = {};
products.forEach(product => {
  brandStats[product.brand] = (brandStats[product.brand] || 0) + 1;
});

console.log('\n🏷️ BRAND BREAKDOWN:');
Object.entries(brandStats).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
  console.log(`  ${brand}: ${count} products`);
});

console.log(`\n📸 PLACEHOLDER IMAGE ASSIGNMENTS:`);
console.log(`Total products with images: ${products.filter(p => p.image).length}/${products.length}`);
console.log(`Products with placeholder images: ${updatedCount}`);

console.log('\n✅ All products now have category-relevant placeholder images ready for editing!');