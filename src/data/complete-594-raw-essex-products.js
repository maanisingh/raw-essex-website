// Complete Raw Essex Product Catalog - 0 Products
// Scraped from https://www.rawessex.co.uk/collections/all (all 25 pages)
// Generated on 2025-09-20T23:32:32.390Z

const complete594RawEssexProducts = [];

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
