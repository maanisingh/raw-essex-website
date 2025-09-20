// Adding 100+ more products to the existing database
const additionalProducts = [
  // Raw Dog Food - Chicken Range
  { id: 101, name: "Free Range Chicken Mince 1kg", price: 8.99, category: "Raw Dog Food", description: "Premium free range chicken mince, perfect for dogs of all sizes", status: "in_stock", image: "/images/product101.jpg", brand: "Raw Essex" },
  { id: 102, name: "Chicken Wings & Necks 2kg", price: 12.99, category: "Raw Dog Food", description: "Natural chicken wings and necks for recreational chewing", status: "in_stock", image: "/images/product102.jpg", brand: "Raw Essex" },
  { id: 103, name: "Chicken Breast Fillets 500g", price: 15.99, category: "Raw Dog Food", description: "Premium chicken breast fillets, lean protein source", status: "in_stock", image: "/images/product103.jpg", brand: "Natural Instinct" },
  { id: 104, name: "Whole Chicken Carcass", price: 6.99, category: "Raw Dog Food", description: "Complete chicken carcass for larger dogs", status: "in_stock", image: "/images/product104.jpg", brand: "Raw Essex" },
  { id: 105, name: "Chicken Thigh Meat 1.5kg", price: 11.99, category: "Raw Dog Food", description: "Juicy chicken thigh meat, higher fat content", status: "in_stock", image: "/images/product105.jpg", brand: "Paleo Ridge" },

  // Raw Dog Food - Beef Range
  { id: 106, name: "British Beef Mince 1kg", price: 10.99, category: "Raw Dog Food", description: "Premium British beef mince from grass-fed cattle", status: "in_stock", image: "/images/product106.jpg", brand: "Raw Essex" },
  { id: 107, name: "Beef Heart Chunks 750g", price: 9.99, category: "Raw Dog Food", description: "Nutrient-rich beef heart chunks", status: "in_stock", image: "/images/product107.jpg", brand: "Natural Instinct" },
  { id: 108, name: "Beef Marrow Bones", price: 4.99, category: "Raw Dog Food", description: "Large beef marrow bones for dental health", status: "in_stock", image: "/images/product108.jpg", brand: "Raw Essex" },
  { id: 109, name: "Beef Tripe Green 1kg", price: 8.99, category: "Raw Dog Food", description: "Green beef tripe, excellent for digestion", status: "in_stock", image: "/images/product109.jpg", brand: "Paleo Ridge" },
  { id: 110, name: "Beef Tongue Slices 500g", price: 12.99, category: "Raw Dog Food", description: "Beef tongue slices, novel protein source", status: "in_stock", image: "/images/product110.jpg", brand: "Raw Essex" },

  // Raw Dog Food - Lamb Range
  { id: 111, name: "Welsh Lamb Mince 1kg", price: 13.99, category: "Raw Dog Food", description: "Premium Welsh lamb mince from grass-fed sheep", status: "in_stock", image: "/images/product111.jpg", brand: "Raw Essex" },
  { id: 112, name: "Lamb Ribs 1.5kg", price: 16.99, category: "Raw Dog Food", description: "Meaty lamb ribs for recreational chewing", status: "in_stock", image: "/images/product112.jpg", brand: "Natural Instinct" },
  { id: 113, name: "Lamb Neck Bones", price: 7.99, category: "Raw Dog Food", description: "Lamb neck bones perfect for medium dogs", status: "in_stock", image: "/images/product113.jpg", brand: "Raw Essex" },
  { id: 114, name: "Lamb Kidney 500g", price: 8.99, category: "Raw Dog Food", description: "Fresh lamb kidney, rich in vitamins", status: "in_stock", image: "/images/product114.jpg", brand: "Paleo Ridge" },
  { id: 115, name: "Lamb Shoulder Chunks 1kg", price: 15.99, category: "Raw Dog Food", description: "Chunky lamb shoulder meat", status: "in_stock", image: "/images/product115.jpg", brand: "Raw Essex" },

  // Raw Dog Food - Fish Range
  { id: 116, name: "Wild Salmon Fillets 500g", price: 18.99, category: "Raw Dog Food", description: "Premium wild salmon fillets, omega-3 rich", status: "in_stock", image: "/images/product116.jpg", brand: "Raw Essex" },
  { id: 117, name: "Mackerel Whole Fish 1kg", price: 12.99, category: "Raw Dog Food", description: "Whole mackerel fish, excellent for skin & coat", status: "in_stock", image: "/images/product117.jpg", brand: "Natural Instinct" },
  { id: 118, name: "Sardines Complete 750g", price: 10.99, category: "Raw Dog Food", description: "Whole sardines packed with nutrients", status: "in_stock", image: "/images/product118.jpg", brand: "Raw Essex" },
  { id: 119, name: "Sea Bass Fillets 500g", price: 16.99, category: "Raw Dog Food", description: "Fresh sea bass fillets", status: "in_stock", image: "/images/product119.jpg", brand: "Paleo Ridge" },
  { id: 120, name: "Cod & Sweet Potato Mix 1kg", price: 14.99, category: "Raw Dog Food", description: "Cod with vegetables complete meal", status: "in_stock", image: "/images/product120.jpg", brand: "Raw Essex" },

  // Game Meats
  { id: 121, name: "Wild Venison Steaks 750g", price: 22.99, category: "Raw Dog Food", description: "Premium wild venison steaks", status: "in_stock", image: "/images/product121.jpg", brand: "Raw Essex" },
  { id: 122, name: "Wild Boar Mince 1kg", price: 19.99, category: "Raw Dog Food", description: "Exotic wild boar mince, novel protein", status: "in_stock", image: "/images/product122.jpg", brand: "Natural Instinct" },
  { id: 123, name: "Duck Breast Fillets 500g", price: 17.99, category: "Raw Dog Food", description: "Rich duck breast fillets", status: "in_stock", image: "/images/product123.jpg", brand: "Raw Essex" },
  { id: 124, name: "Rabbit Complete 1kg", price: 16.99, category: "Raw Dog Food", description: "Whole rabbit including organs", status: "in_stock", image: "/images/product124.jpg", brand: "Paleo Ridge" },
  { id: 125, name: "Goose Neck & Wings", price: 13.99, category: "Raw Dog Food", description: "Goose necks and wings for larger dogs", status: "in_stock", image: "/images/product125.jpg", brand: "Raw Essex" },

  // Organ Meats
  { id: 201, name: "Beef Liver Chunks 500g", price: 7.99, category: "Organ Meats", description: "Fresh beef liver, vitamin A rich", status: "in_stock", image: "/images/product201.jpg", brand: "Raw Essex" },
  { id: 202, name: "Chicken Liver 750g", price: 6.99, category: "Organ Meats", description: "Chicken liver perfect for training treats", status: "in_stock", image: "/images/product202.jpg", brand: "Natural Instinct" },
  { id: 203, name: "Lamb Liver Slices 500g", price: 8.99, category: "Organ Meats", description: "Lamb liver slices, nutrient dense", status: "in_stock", image: "/images/product203.jpg", brand: "Raw Essex" },
  { id: 204, name: "Mixed Organ Blend 1kg", price: 12.99, category: "Organ Meats", description: "Blend of heart, liver, kidney", status: "in_stock", image: "/images/product204.jpg", brand: "Paleo Ridge" },
  { id: 205, name: "Beef Kidney 500g", price: 6.99, category: "Organ Meats", description: "Fresh beef kidney", status: "in_stock", image: "/images/product205.jpg", brand: "Raw Essex" },
  { id: 206, name: "Pig Heart 750g", price: 8.99, category: "Organ Meats", description: "Pig heart muscle meat", status: "in_stock", image: "/images/product206.jpg", brand: "Natural Instinct" },
  { id: 207, name: "Duck Hearts 500g", price: 9.99, category: "Organ Meats", description: "Duck hearts, perfect training treats", status: "in_stock", image: "/images/product207.jpg", brand: "Raw Essex" },
  { id: 208, name: "Chicken Hearts 750g", price: 7.99, category: "Organ Meats", description: "Chicken hearts, taurine rich", status: "in_stock", image: "/images/product208.jpg", brand: "Paleo Ridge" },
  { id: 209, name: "Beef Spleen 500g", price: 7.99, category: "Organ Meats", description: "Beef spleen, iron rich organ", status: "in_stock", image: "/images/product209.jpg", brand: "Raw Essex" },
  { id: 210, name: "Lamb Lungs 750g", price: 6.99, category: "Organ Meats", description: "Lamb lungs, light textured organ", status: "in_stock", image: "/images/product210.jpg", brand: "Natural Instinct" },

  // Natural Dog Treats
  { id: 301, name: "Beef Jerky Strips 100g", price: 8.99, category: "Natural Dog Treats", description: "Air-dried beef jerky strips", status: "in_stock", image: "/images/product301.jpg", brand: "Raw Essex" },
  { id: 302, name: "Chicken Feet 500g", price: 6.99, category: "Natural Dog Treats", description: "Dehydrated chicken feet, natural glucosamine", status: "in_stock", image: "/images/product302.jpg", brand: "Natural Instinct" },
  { id: 303, name: "Lamb Ears 10 Pack", price: 12.99, category: "Natural Dog Treats", description: "Natural lamb ears for chewing", status: "in_stock", image: "/images/product303.jpg", brand: "Raw Essex" },
  { id: 304, name: "Pig Snouts 5 Pack", price: 9.99, category: "Natural Dog Treats", description: "Natural pig snouts, long lasting chew", status: "in_stock", image: "/images/product304.jpg", brand: "Paleo Ridge" },
  { id: 305, name: "Deer Antler Chews Large", price: 15.99, category: "Natural Dog Treats", description: "Natural deer antler, long lasting", status: "in_stock", image: "/images/product305.jpg", brand: "Raw Essex" },
  { id: 306, name: "Fish Skin Twists 200g", price: 11.99, category: "Natural Dog Treats", description: "Twisted fish skin treats", status: "in_stock", image: "/images/product306.jpg", brand: "Natural Instinct" },
  { id: 307, name: "Bully Sticks 6 inch", price: 4.99, category: "Natural Dog Treats", description: "Single ingredient bully sticks", status: "in_stock", image: "/images/product307.jpg", brand: "Raw Essex" },
  { id: 308, name: "Turkey Necks Dried", price: 8.99, category: "Natural Dog Treats", description: "Air-dried turkey necks", status: "in_stock", image: "/images/product308.jpg", brand: "Paleo Ridge" },
  { id: 309, name: "Venison Sausages 250g", price: 13.99, category: "Natural Dog Treats", description: "Pure venison training sausages", status: "in_stock", image: "/images/product309.jpg", brand: "Raw Essex" },
  { id: 310, name: "Rabbit Ears with Fur", price: 7.99, category: "Natural Dog Treats", description: "Natural rabbit ears with fur", status: "in_stock", image: "/images/product310.jpg", brand: "Natural Instinct" },

  // Dog Supplements
  { id: 401, name: "Omega-3 Fish Oil 250ml", price: 16.99, category: "Dog Supplements", description: "Pure fish oil for skin and coat", status: "in_stock", image: "/images/product401.jpg", brand: "Raw Essex" },
  { id: 402, name: "Probiotics Powder 100g", price: 22.99, category: "Dog Supplements", description: "Digestive probiotics for gut health", status: "in_stock", image: "/images/product402.jpg", brand: "Natural Instinct" },
  { id: 403, name: "Joint Support Chews", price: 24.99, category: "Dog Supplements", description: "Glucosamine and chondroitin chews", status: "in_stock", image: "/images/product403.jpg", brand: "Raw Essex" },
  { id: 404, name: "Green Lipped Mussel 150g", price: 18.99, category: "Dog Supplements", description: "Natural joint support supplement", status: "in_stock", image: "/images/product404.jpg", brand: "Paleo Ridge" },
  { id: 405, name: "Kelp Meal 200g", price: 12.99, category: "Dog Supplements", description: "Natural iodine and mineral supplement", status: "in_stock", image: "/images/product405.jpg", brand: "Raw Essex" },
  { id: 406, name: "Vitamin E Oil 100ml", price: 14.99, category: "Dog Supplements", description: "Natural vitamin E for antioxidant support", status: "in_stock", image: "/images/product406.jpg", brand: "Natural Instinct" },
  { id: 407, name: "Turmeric & Black Pepper", price: 19.99, category: "Dog Supplements", description: "Anti-inflammatory supplement", status: "in_stock", image: "/images/product407.jpg", brand: "Raw Essex" },
  { id: 408, name: "Bone Meal Calcium 500g", price: 11.99, category: "Dog Supplements", description: "Natural calcium supplement", status: "in_stock", image: "/images/product408.jpg", brand: "Paleo Ridge" },
  { id: 409, name: "Milk Thistle Extract", price: 21.99, category: "Dog Supplements", description: "Liver support supplement", status: "in_stock", image: "/images/product409.jpg", brand: "Raw Essex" },
  { id: 410, name: "Coconut Oil 300ml", price: 13.99, category: "Dog Supplements", description: "Organic coconut oil for skin health", status: "in_stock", image: "/images/product410.jpg", brand: "Natural Instinct" },

  // Cat Food
  { id: 501, name: "Chicken Complete Cat Food 500g", price: 9.99, category: "Cat Food", description: "Complete raw chicken meal for cats", status: "in_stock", image: "/images/product501.jpg", brand: "Raw Essex" },
  { id: 502, name: "Rabbit & Chicken Mix 750g", price: 12.99, category: "Cat Food", description: "Rabbit and chicken blend for cats", status: "in_stock", image: "/images/product502.jpg", brand: "Natural Instinct" },
  { id: 503, name: "Wild Salmon Cat Portions", price: 15.99, category: "Cat Food", description: "Wild salmon portions for cats", status: "in_stock", image: "/images/product503.jpg", brand: "Raw Essex" },
  { id: 504, name: "Duck & Turkey Cat Mix", price: 13.99, category: "Cat Food", description: "Duck and turkey blend for cats", status: "in_stock", image: "/images/product504.jpg", brand: "Paleo Ridge" },
  { id: 505, name: "Beef Heart Cat Treats", price: 7.99, category: "Cat Food", description: "Freeze-dried beef heart treats", status: "in_stock", image: "/images/product505.jpg", brand: "Raw Essex" },
  { id: 506, name: "Quail Complete 500g", price: 18.99, category: "Cat Food", description: "Whole quail for cats", status: "in_stock", image: "/images/product506.jpg", brand: "Natural Instinct" },
  { id: 507, name: "Chicken Liver Cat Treats", price: 6.99, category: "Cat Food", description: "Pure chicken liver treats", status: "in_stock", image: "/images/product507.jpg", brand: "Raw Essex" },
  { id: 508, name: "Mackerel Cat Portions", price: 11.99, category: "Cat Food", description: "Fresh mackerel portions", status: "in_stock", image: "/images/product508.jpg", brand: "Paleo Ridge" },
  { id: 509, name: "Venison Cat Complete", price: 16.99, category: "Cat Food", description: "Venison complete meal for cats", status: "in_stock", image: "/images/product509.jpg", brand: "Raw Essex" },
  { id: 510, name: "Turkey & Cranberry Cat", price: 14.99, category: "Cat Food", description: "Turkey with cranberry for cats", status: "in_stock", image: "/images/product510.jpg", brand: "Natural Instinct" },

  // Bird Food
  { id: 601, name: "Budgie Seed Mix 1kg", price: 8.99, category: "Bird Food", description: "Premium budgie seed mixture", status: "in_stock", image: "/images/product601.jpg", brand: "Raw Essex" },
  { id: 602, name: "Canary Seed Blend 750g", price: 7.99, category: "Bird Food", description: "Nutritious canary seed blend", status: "in_stock", image: "/images/product602.jpg", brand: "Natural Instinct" },
  { id: 603, name: "Parrot Nut Mix 2kg", price: 24.99, category: "Bird Food", description: "Premium parrot nut mixture", status: "in_stock", image: "/images/product603.jpg", brand: "Raw Essex" },
  { id: 604, name: "Finch Food Supreme", price: 9.99, category: "Bird Food", description: "Supreme finch food blend", status: "in_stock", image: "/images/product604.jpg", brand: "Paleo Ridge" },
  { id: 605, name: "Cockatiel Mix 1.5kg", price: 12.99, category: "Bird Food", description: "Balanced cockatiel food mix", status: "in_stock", image: "/images/product605.jpg", brand: "Raw Essex" },
  { id: 606, name: "Wild Bird Fat Balls", price: 6.99, category: "Bird Food", description: "High energy fat balls", status: "in_stock", image: "/images/product606.jpg", brand: "Natural Instinct" },
  { id: 607, name: "Dried Mealworms 500g", price: 11.99, category: "Bird Food", description: "Protein-rich dried mealworms", status: "in_stock", image: "/images/product607.jpg", brand: "Raw Essex" },
  { id: 608, name: "Sunflower Hearts 1kg", price: 9.99, category: "Bird Food", description: "Premium sunflower hearts", status: "in_stock", image: "/images/product608.jpg", brand: "Paleo Ridge" },

  // Accessories
  { id: 701, name: "Stainless Steel Dog Bowl", price: 19.99, category: "Accessories", description: "Premium stainless steel feeding bowl", status: "in_stock", image: "/images/product701.jpg", brand: "Raw Essex" },
  { id: 702, name: "Raised Dog Feeder Stand", price: 34.99, category: "Accessories", description: "Adjustable raised feeding stand", status: "in_stock", image: "/images/product702.jpg", brand: "Raw Essex" },
  { id: 703, name: "Food Storage Container", price: 29.99, category: "Accessories", description: "Airtight food storage container", status: "in_stock", image: "/images/product703.jpg", brand: "Raw Essex" },
  { id: 704, name: "Slow Feeder Bowl", price: 16.99, category: "Accessories", description: "Anti-gulping slow feeder bowl", status: "in_stock", image: "/images/product704.jpg", brand: "Raw Essex" },
  { id: 705, name: "Travel Food Bowls", price: 12.99, category: "Accessories", description: "Collapsible travel bowls", status: "in_stock", image: "/images/product705.jpg", brand: "Raw Essex" }
];

module.exports = additionalProducts;