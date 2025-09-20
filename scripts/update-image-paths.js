const fs = require('fs');
const path = require('path');

// Read the current products file
const productsPath = path.join(__dirname, '../src/data/raw-essex-products.js');
let content = fs.readFileSync(productsPath, 'utf8');

console.log('🔧 Updating product image paths to local images...');

// Replace all external image URLs with local paths
let updateCount = 0;

// Replace We Love Raw images
content = content.replace(
  /image: "https:\/\/www\.rawessex\.co\.uk\/cdn\/shop\/files\/wlr_logo_full-removebg-preview_2white_fluff_100x_2x_068ee26e-8ae4-4cd6-8351-4dc6334f573a\.avif"/g,
  (match, offset) => {
    // Find the product ID by looking backward for the id field
    const beforeMatch = content.substring(0, offset);
    const idMatch = beforeMatch.match(/id: (\d+),?(?:[^}]*)$/);
    if (idMatch) {
      updateCount++;
      return `image: "/images/product${idMatch[1]}.jpg"`;
    }
    return match;
  }
);

// Replace Canagan chicken images
content = content.replace(
  /image: "https:\/\/www\.rawessex\.co\.uk\/cdn\/shop\/files\/canagan-cat-soup-chicken-140g-p2398-3670_medium_8ecbf969-a211-47a9-ba04-309c7bbdd573\.png"/g,
  (match, offset) => {
    const beforeMatch = content.substring(0, offset);
    const idMatch = beforeMatch.match(/id: (\d+),?(?:[^}]*)$/);
    if (idMatch) {
      updateCount++;
      return `image: "/images/product${idMatch[1]}.jpg"`;
    }
    return match;
  }
);

// Replace Canagan tuna images
content = content.replace(
  /image: "https:\/\/www\.rawessex\.co\.uk\/cdn\/shop\/files\/canagan-cat-soup-tuna-140g-p2400-3675_image\.png"/g,
  (match, offset) => {
    const beforeMatch = content.substring(0, offset);
    const idMatch = beforeMatch.match(/id: (\d+),?(?:[^}]*)$/);
    if (idMatch) {
      updateCount++;
      return `image: "/images/product${idMatch[1]}.jpg"`;
    }
    return match;
  }
);

// Replace Yora images
content = content.replace(
  /image: "https:\/\/www\.rawessex\.co\.uk\/cdn\/shop\/files\/OIP_[89]\.jpg"/g,
  (match, offset) => {
    const beforeMatch = content.substring(0, offset);
    const idMatch = beforeMatch.match(/id: (\d+),?(?:[^}]*)$/);
    if (idMatch) {
      updateCount++;
      return `image: "/images/product${idMatch[1]}.jpg"`;
    }
    return match;
  }
);

// Replace bird food images
content = content.replace(
  /image: "https:\/\/www\.rawessex\.co\.uk\/cdn\/shop\/files\/[^"]+"/g,
  (match, offset) => {
    const beforeMatch = content.substring(0, offset);
    const idMatch = beforeMatch.match(/id: (\d+),?(?:[^}]*)$/);
    if (idMatch) {
      updateCount++;
      return `image: "/images/product${idMatch[1]}.jpg"`;
    }
    return match;
  }
);

// Write the updated content back
fs.writeFileSync(productsPath, content);

console.log(`✅ Updated ${updateCount} product image paths!`);
console.log('📸 All products now use local image paths');