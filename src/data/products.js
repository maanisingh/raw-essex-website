const products = [
  // We Love Raw - Premium Range
  {
    id: 1,
    name: "We Love Raw Wild British Pheasant Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Premium wild British pheasant burgers for dogs",
    status: "out_of_stock",
    image: "/images/product1.jpg",
    brand: "We Love Raw"
  },
  {
    id: 2,
    name: "We Love Raw Wild British Pheasant 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Wild British pheasant raw dog food - 750g pack",
    status: "in_stock",
    image: "/images/product2.jpg",
    brand: "We Love Raw"
  },
  {
    id: 3,
    name: "We Love Raw British Wood Pigeon Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "British wood pigeon burgers for dogs",
    status: "out_of_stock",
    image: "/images/product3.jpg",
    brand: "We Love Raw"
  },
  {
    id: 4,
    name: "We Love Raw British Wood Pigeon 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "British wood pigeon raw dog food - 1.5kg pack",
    status: "in_stock",
    image: "/images/product4.jpg",
    brand: "We Love Raw"
  },
  {
    id: 5,
    name: "We Love Raw Venison Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Premium venison burgers for dogs",
    status: "in_stock",
    image: "/images/product5.jpg",
    brand: "We Love Raw"
  },
  {
    id: 6,
    name: "We Love Raw Venison 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Premium venison raw dog food - 750g pack",
    status: "in_stock",
    image: "/images/product1.jpg",
    brand: "We Love Raw"
  },
  {
    id: 7,
    name: "We Love Raw Rabbit Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Wild rabbit burgers for dogs",
    status: "in_stock",
    image: "/images/product2.jpg",
    brand: "We Love Raw"
  },
  {
    id: 8,
    name: "We Love Raw Rabbit 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Wild rabbit raw dog food - 1.5kg pack",
    status: "in_stock",
    image: "/images/product3.jpg",
    brand: "We Love Raw"
  },
  {
    id: 9,
    name: "We Love Raw Beef Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Premium beef burgers for dogs",
    status: "in_stock",
    image: "/images/product4.jpg",
    brand: "We Love Raw"
  },
  {
    id: 10,
    name: "We Love Raw Beef 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Premium beef raw dog food - 1.5kg pack",
    status: "in_stock",
    image: "/images/product5.jpg",
    brand: "We Love Raw"
  },
  {
    id: 11,
    name: "We Love Raw Lamb Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Premium lamb burgers for dogs",
    status: "in_stock",
    image: "/images/product1.jpg",
    brand: "We Love Raw"
  },
  {
    id: 12,
    name: "We Love Raw Lamb 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Premium lamb raw dog food - 1.5kg pack",
    status: "in_stock",
    image: "/images/product2.jpg",
    brand: "We Love Raw"
  },
  {
    id: 13,
    name: "We Love Raw Gamekeepers Choice 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Mixed game meat selection - 1.5kg pack",
    status: "in_stock",
    image: "/images/product3.jpg",
    brand: "We Love Raw"
  },
  {
    id: 14,
    name: "We Love Raw Duck & Salmon 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Duck and salmon mix - 1.5kg pack",
    status: "in_stock",
    image: "/images/product4.jpg",
    brand: "We Love Raw"
  },
  {
    id: 15,
    name: "We Love Raw Turkey 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Premium turkey raw dog food - 1.5kg pack",
    status: "in_stock",
    image: "/images/product5.jpg",
    brand: "We Love Raw"
  },

  // Raw Meat Chunks
  {
    id: 16,
    name: "1KG Boar Chunks",
    price: 6.50,
    category: "Raw Dog Food",
    description: "Premium boar chunks for dogs - 1kg pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop&crop=center"
  },
  {
    id: 17,
    name: "1KG Meaty Ox Chunks",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Nutritious meaty ox chunks - 1kg pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center"
  },
  {
    id: 18,
    name: "1kg Lamb Ribs",
    price: 5.00,
    category: "Raw Dog Food",
    description: "Fresh lamb ribs for dogs - 1kg pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&h=500&fit=crop&crop=center"
  },
  {
    id: 19,
    name: "Venison Chunks 500G",
    price: 6.50,
    category: "Raw Dog Food",
    description: "Premium venison chunks - 500g pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500&h=500&fit=crop&crop=center"
  },
  {
    id: 20,
    name: "Goat Meat Chunks 500G",
    price: 8.50,
    category: "Raw Dog Food",
    description: "High-quality goat meat chunks - 500g pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1574781330855-d0db7cc2fe19?w=500&h=500&fit=crop&crop=center"
  },
  {
    id: 21,
    name: "Wild Boar Mince 1kg",
    price: 7.50,
    category: "Raw Dog Food",
    description: "Premium wild boar mince - 1kg pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop&crop=center"
  },
  {
    id: 22,
    name: "Beef Heart 500g",
    price: 4.50,
    category: "Raw Dog Food",
    description: "Fresh beef heart muscle meat - 500g pack",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center"
  },

  // Organ Meats
  {
    id: 23,
    name: "Chicken Liver 500g",
    price: 5.00,
    category: "Organ Meats",
    description: "Fresh chicken liver - 500g pack",
    status: "in_stock",
    image: "/images/chicken-liver.jpg"
  },
  {
    id: 24,
    name: "Ox Kidney 500g",
    price: 5.00,
    category: "Organ Meats",
    description: "Premium ox kidney - 500g pack",
    status: "in_stock",
    image: "/images/ox-kidney.jpg"
  },
  {
    id: 25,
    name: "Ox Heart 500g",
    price: 5.00,
    category: "Organ Meats",
    description: "Nutritious ox heart - 500g pack",
    status: "in_stock",
    image: "/images/ox-heart.jpg"
  },
  {
    id: 26,
    name: "Beef Liver 500g",
    price: 5.50,
    category: "Organ Meats",
    description: "Premium beef liver - 500g pack",
    status: "in_stock",
    image: "/images/beef-liver.jpg"
  },
  {
    id: 27,
    name: "Lamb Liver 500g",
    price: 5.50,
    category: "Organ Meats",
    description: "Fresh lamb liver - 500g pack",
    status: "in_stock",
    image: "/images/lamb-liver.jpg"
  },
  {
    id: 28,
    name: "Pig Kidney 500g",
    price: 4.50,
    category: "Organ Meats",
    description: "Fresh pig kidney - 500g pack",
    status: "in_stock",
    image: "/images/pig-kidney.jpg"
  },

  // Natural Dog Treats
  {
    id: 29,
    name: "Chicken Feet 100g",
    price: 3.50,
    category: "Natural Dog Treats",
    description: "Natural chicken feet treats",
    status: "in_stock",
    image: "/images/chicken-feet.jpg"
  },
  {
    id: 30,
    name: "Duck Necks 500g",
    price: 4.50,
    category: "Natural Dog Treats",
    description: "Natural duck neck treats - 500g pack",
    status: "in_stock",
    image: "/images/duck-necks.jpg"
  },
  {
    id: 31,
    name: "Beef Trachea 100g",
    price: 5.50,
    category: "Natural Dog Treats",
    description: "Natural beef trachea chews",
    status: "in_stock",
    image: "/images/beef-trachea.jpg"
  },
  {
    id: 32,
    name: "Pig Ears 10 Pack",
    price: 8.00,
    category: "Natural Dog Treats",
    description: "Natural pig ear treats - pack of 10",
    status: "in_stock",
    image: "/images/pig-ears.jpg"
  },
  {
    id: 33,
    name: "Lamb Ribs Natural Treats 500g",
    price: 6.50,
    category: "Natural Dog Treats",
    description: "Raw lamb ribs for recreational chewing",
    status: "in_stock",
    image: "/images/lamb-rib-treats.jpg"
  },
  {
    id: 34,
    name: "Beef Bones Large 2 Pack",
    price: 7.50,
    category: "Natural Dog Treats",
    description: "Large recreational beef bones - pack of 2",
    status: "in_stock",
    image: "/images/beef-bones.jpg"
  },
  {
    id: 35,
    name: "Turkey Necks 500g",
    price: 5.50,
    category: "Natural Dog Treats",
    description: "Raw turkey necks for dogs - 500g pack",
    status: "in_stock",
    image: "/images/turkey-necks.jpg"
  },

  // Dog Supplements
  {
    id: 36,
    name: "Anal Gland Blend",
    price: 17.95,
    category: "Dog Supplements",
    description: "Natural anal gland support supplement",
    status: "in_stock",
    image: "/images/anal-gland-blend.jpg"
  },
  {
    id: 37,
    name: "Joint Support Formula",
    price: 24.95,
    category: "Dog Supplements",
    description: "Premium joint health supplement for dogs",
    status: "in_stock",
    image: "/images/joint-support.jpg"
  },
  {
    id: 38,
    name: "Digestive Health Blend",
    price: 19.95,
    category: "Dog Supplements",
    description: "Natural digestive support for dogs",
    status: "in_stock",
    image: "/images/digestive-blend.jpg"
  },
  {
    id: 39,
    name: "Skin & Coat Formula",
    price: 22.50,
    category: "Dog Supplements",
    description: "Omega-rich supplement for healthy skin and coat",
    status: "in_stock",
    image: "/images/skin-coat.jpg"
  },
  {
    id: 40,
    name: "Immune Support Blend",
    price: 21.95,
    category: "Dog Supplements",
    description: "Natural immune system support supplement",
    status: "in_stock",
    image: "/images/immune-support.jpg"
  },
  {
    id: 41,
    name: "Calming Formula",
    price: 18.95,
    category: "Dog Supplements",
    description: "Natural stress and anxiety relief for dogs",
    status: "in_stock",
    image: "/images/calming-formula.jpg"
  },

  // Accessories
  {
    id: 42,
    name: "Almond Charm Collar",
    price: 8.00,
    category: "Accessories",
    description: "Stylish almond charm collar for dogs",
    status: "in_stock",
    image: "/images/almond-collar.jpg"
  },
  {
    id: 43,
    name: "Almond Charm Harness",
    price: 20.00,
    category: "Accessories",
    description: "Comfortable almond charm harness",
    status: "in_stock",
    image: "/images/almond-harness.jpg"
  },
  {
    id: 44,
    name: "Premium Dog Bowl Set",
    price: 25.00,
    category: "Accessories",
    description: "Stainless steel dog bowl set with stand",
    status: "in_stock",
    image: "/images/dog-bowl-set.jpg"
  },
  {
    id: 45,
    name: "Raw Food Storage Container 5L",
    price: 35.00,
    category: "Accessories",
    description: "Airtight container for raw food storage - 5L capacity",
    status: "in_stock",
    image: "/images/storage-container.jpg"
  },
  {
    id: 46,
    name: "Freezer Storage Bags 50 Pack",
    price: 12.50,
    category: "Accessories",
    description: "BPA-free freezer bags for raw food portioning",
    status: "in_stock",
    image: "/images/freezer-bags.jpg"
  },
  {
    id: 47,
    name: "Raw Feeding Guide Book",
    price: 15.00,
    category: "Accessories",
    description: "Comprehensive guide to raw feeding for dogs",
    status: "in_stock",
    image: "/images/guide-book.jpg"
  },

  // Cat Food
  {
    id: 48,
    name: "Raw Cat Chicken 500g",
    price: 4.50,
    category: "Cat Food",
    description: "Premium raw chicken for cats - 500g pack",
    status: "in_stock",
    image: "/images/cat-chicken.jpg"
  },
  {
    id: 49,
    name: "Raw Cat Beef 500g",
    price: 5.00,
    category: "Cat Food",
    description: "Premium raw beef for cats - 500g pack",
    status: "in_stock",
    image: "/images/cat-beef.jpg"
  },
  {
    id: 50,
    name: "Cat Liver Treats 100g",
    price: 3.50,
    category: "Cat Food",
    description: "Natural liver treats for cats",
    status: "in_stock",
    image: "/images/cat-liver.jpg"
  },
  {
    id: 51,
    name: "Raw Cat Rabbit 500g",
    price: 6.00,
    category: "Cat Food",
    description: "Novel protein raw rabbit for cats - 500g pack",
    status: "in_stock",
    image: "/images/cat-rabbit.jpg"
  },
  {
    id: 52,
    name: "Cat Fish Selection 300g",
    price: 5.50,
    category: "Cat Food",
    description: "Mixed fish selection for cats - 300g pack",
    status: "in_stock",
    image: "/images/cat-fish.jpg"
  },

  // Bird Food
  {
    id: 53,
    name: "Premium Bird Seed Mix 2kg",
    price: 12.50,
    category: "Bird Food",
    description: "High-quality seed mix for wild birds - 2kg pack",
    status: "in_stock",
    image: "/images/bird-seed.jpg"
  },
  {
    id: 54,
    name: "Nyjer Seed 1kg",
    price: 8.50,
    category: "Bird Food",
    description: "Premium nyjer seed for finches - 1kg pack",
    status: "in_stock",
    image: "/images/nyjer-seed.jpg"
  },
  {
    id: 55,
    name: "Sunflower Hearts 2kg",
    price: 15.00,
    category: "Bird Food",
    description: "High-energy sunflower hearts - 2kg pack",
    status: "in_stock",
    image: "/images/sunflower-hearts.jpg"
  },
  {
    id: 56,
    name: "Robin & Songbird Mix 1kg",
    price: 7.50,
    category: "Bird Food",
    description: "Specialized mix for robins and songbirds",
    status: "in_stock",
    image: "/images/robin-mix.jpg"
  },
  {
    id: 57,
    name: "Fat Balls 50 Pack",
    price: 18.00,
    category: "Bird Food",
    description: "High-energy fat balls for wild birds - 50 pack",
    status: "in_stock",
    image: "/images/fat-balls.jpg"
  }
];

// Import complete Raw Essex catalog
const { products: rawEssexCompleteProducts } = require('../../complete-raw-essex-products');

// Combine original products with complete Raw Essex catalog
const allProducts = [...products, ...rawEssexCompleteProducts];

module.exports = allProducts;