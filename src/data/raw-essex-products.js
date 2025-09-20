// Complete Raw Essex Product Database - Based on rawessex.co.uk
const rawEssexProducts = [
  // DOG RAW FOOD - We Love Raw Range
  // Wild British Pheasant
  {
    id: 1,
    name: "Wild British Pheasant Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Premium wild British pheasant formed into convenient burger shapes. Rich in protein and perfect for dogs with sensitive stomachs.",
    status: "out_of_stock",
    image: "/images/product1.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Pheasant",
    tags: ["wild", "british", "game", "novel protein"]
  },
  {
    id: 2,
    name: "Wild British Pheasant 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Premium wild British pheasant in convenient 750g portions. Excellent source of lean protein.",
    status: "out_of_stock",
    image: "/images/product2.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Pheasant",
    tags: ["wild", "british", "game", "novel protein"]
  },

  // British Wood Pigeon
  {
    id: 3,
    name: "British Wood Pigeon Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Wild British wood pigeon formed into burger shapes. A lean, novel protein source perfect for dogs with allergies.",
    status: "out_of_stock",
    image: "/images/product3.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Wood Pigeon",
    tags: ["wild", "british", "game", "novel protein", "hypoallergenic"]
  },
  {
    id: 4,
    name: "British Wood Pigeon 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Wild British wood pigeon in 750g portions. Lean game meat packed with natural nutrients.",
    status: "out_of_stock",
    image: "/images/product4.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Wood Pigeon",
    tags: ["wild", "british", "game", "novel protein", "hypoallergenic"]
  },
  {
    id: 5,
    name: "British Wood Pigeon 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Bulk pack of wild British wood pigeon. Great value for multi-dog households.",
    status: "out_of_stock",
    image: "/images/product5.jpg",
    brand: "We Love Raw",
    weight: "1.5kg",
    protein: "Wood Pigeon",
    tags: ["wild", "british", "game", "novel protein", "bulk"]
  },

  // British Venison
  {
    id: 6,
    name: "British Venison Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Premium British venison formed into convenient burger shapes. Rich in iron and perfect for active dogs.",
    status: "in_stock",
    image: "/images/product6.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Venison",
    tags: ["british", "game", "lean", "iron-rich"]
  },
  {
    id: 7,
    name: "British Venison 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Premium British venison in 750g portions. Lean game meat with exceptional nutritional value.",
    status: "in_stock",
    image: "/images/product7.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Venison",
    tags: ["british", "game", "lean", "iron-rich"]
  },
  {
    id: 8,
    name: "British Venison 1.5kg",
    price: 10.00,
    category: "Raw Dog Food",
    description: "Bulk pack of premium British venison. Excellent value for larger dogs or multi-pet households.",
    status: "in_stock",
    image: "/images/product8.jpg",
    brand: "We Love Raw",
    weight: "1.5kg",
    protein: "Venison",
    tags: ["british", "game", "lean", "bulk"]
  },

  // British Rabbit
  {
    id: 9,
    name: "British Rabbit Burgers",
    price: 10.00,
    category: "Raw Dog Food",
    description: "British rabbit formed into burger shapes. Easily digestible and perfect for dogs with food sensitivities.",
    status: "in_stock",
    image: "/images/product9.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Rabbit",
    tags: ["british", "hypoallergenic", "digestible", "novel protein"]
  },
  {
    id: 10,
    name: "British Rabbit 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "British rabbit in 750g portions. Low-fat, highly digestible protein source.",
    status: "in_stock",
    image: "/images/product10.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Rabbit",
    tags: ["british", "low-fat", "digestible", "novel protein"]
  },
  {
    id: 11,
    name: "British Rabbit 1.5kg",
    price: 9.00,
    category: "Raw Dog Food",
    description: "Bulk pack of British rabbit. Great value for dogs with sensitive digestion.",
    status: "in_stock",
    image: "/images/product11.jpg",
    brand: "We Love Raw",
    weight: "1.5kg",
    protein: "Rabbit",
    tags: ["british", "bulk", "sensitive", "digestible"]
  },

  // British Beef Complete
  {
    id: 12,
    name: "British Beef Complete Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Complete British beef meal in burger form. Includes organs and bone for balanced nutrition.",
    status: "in_stock",
    image: "/images/product12.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Beef",
    tags: ["british", "complete", "balanced", "organs"]
  },
  {
    id: 13,
    name: "British Beef Complete 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Complete British beef meal in 750g portions. Nutritionally balanced with meat, organs, and bone.",
    status: "in_stock",
    image: "/images/product13.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Beef",
    tags: ["british", "complete", "balanced", "nutritious"]
  },
  {
    id: 14,
    name: "British Beef Complete 1.5kg",
    price: 11.00,
    category: "Raw Dog Food",
    description: "Bulk pack of complete British beef meal. Perfect for larger dogs requiring complete nutrition.",
    status: "in_stock",
    image: "/images/product14.jpg",
    brand: "We Love Raw",
    weight: "1.5kg",
    protein: "Beef",
    tags: ["british", "complete", "bulk", "large dogs"]
  },

  // British Lamb Complete
  {
    id: 15,
    name: "British Lamb Complete Burgers",
    price: 12.00,
    category: "Raw Dog Food",
    description: "Complete British lamb meal in burger form. Rich in protein and essential amino acids.",
    status: "in_stock",
    image: "/images/product15.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Lamb",
    tags: ["british", "complete", "amino acids", "rich"]
  },
  {
    id: 16,
    name: "British Lamb Complete 750g",
    price: 6.00,
    category: "Raw Dog Food",
    description: "Complete British lamb meal in 750g portions. Balanced nutrition with meat, organs, and bone.",
    status: "in_stock",
    image: "/images/product16.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Lamb",
    tags: ["british", "complete", "balanced", "nutritious"]
  },
  {
    id: 17,
    name: "British Lamb Complete 1.5kg",
    price: 11.00,
    category: "Raw Dog Food",
    description: "Bulk pack of complete British lamb meal. Excellent for dogs preferring lamb protein.",
    status: "in_stock",
    image: "/images/product17.jpg",
    brand: "We Love Raw",
    weight: "1.5kg",
    protein: "Lamb",
    tags: ["british", "complete", "bulk", "preference"]
  },

  // Gamekeepers Choice
  {
    id: 18,
    name: "Gamekeepers Choice Burgers",
    price: 14.00,
    category: "Raw Dog Food",
    description: "Mixed game meat selection in burger form. Perfect for dogs who love variety in their diet.",
    status: "in_stock",
    image: "/images/product18.jpg",
    brand: "We Love Raw",
    weight: "Burgers",
    protein: "Mixed Game",
    tags: ["game", "variety", "mixed", "premium"]
  },
  {
    id: 19,
    name: "Gamekeepers Choice 750g",
    price: 6.50,
    category: "Raw Dog Food",
    description: "Mixed game meat selection in 750g portions. Variety pack of different game meats.",
    status: "in_stock",
    image: "/images/product19.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Mixed Game",
    tags: ["game", "variety", "mixed", "selection"]
  },

  // Duck and Salmon Complete
  {
    id: 20,
    name: "Duck and Salmon Complete 750g",
    price: 5.50,
    category: "Raw Dog Food",
    description: "Complete meal combining duck and salmon. Rich in omega-3 fatty acids for healthy skin and coat.",
    status: "in_stock",
    image: "/images/product20.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Duck & Salmon",
    tags: ["duck", "salmon", "omega-3", "skin health"]
  },
  {
    id: 21,
    name: "Duck and Salmon Complete 1.5kg",
    price: 9.00,
    category: "Raw Dog Food",
    description: "Bulk pack of duck and salmon complete meal. Perfect for dogs with coat issues.",
    status: "in_stock",
    image: "/images/product21.jpg",
    brand: "We Love Raw",
    weight: "1.5kg",
    protein: "Duck & Salmon",
    tags: ["duck", "salmon", "bulk", "coat health"]
  },

  // Turkey Variants
  {
    id: 22,
    name: "Turkey and Salmon Complete",
    price: 5.50,
    category: "Raw Dog Food",
    description: "Complete meal combining turkey and salmon. Lean protein with omega-3 benefits.",
    status: "in_stock",
    image: "/images/product22.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Turkey & Salmon",
    tags: ["turkey", "salmon", "lean", "omega-3"]
  },
  {
    id: 23,
    name: "Turkey and Venison Complete",
    price: 5.50,
    category: "Raw Dog Food",
    description: "Complete meal combining turkey and venison. Lean proteins with excellent nutritional value.",
    status: "in_stock",
    image: "/images/product23.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Turkey & Venison",
    tags: ["turkey", "venison", "lean", "nutritious"]
  },
  {
    id: 24,
    name: "Turkey Complete",
    price: 5.50,
    category: "Raw Dog Food",
    description: "Complete turkey meal. Lean, easily digestible protein perfect for weight management.",
    status: "in_stock",
    image: "/images/product24.jpg",
    brand: "We Love Raw",
    weight: "750g",
    protein: "Turkey",
    tags: ["turkey", "lean", "digestible", "weight management"]
  },

  // CAT FOOD - Canagan Wet Food Range
  // Canagan Cat Soup
  {
    id: 25,
    name: "Canagan Cat Soup Chicken",
    price: 1.50,
    category: "Cat Food",
    description: "Premium chicken soup for cats. Grain-free and made with fresh chicken.",
    status: "in_stock",
    image: "/images/product25.jpg",
    brand: "Canagan",
    weight: "140g",
    protein: "Chicken",
    tags: ["soup", "grain-free", "premium", "wet food"]
  },
  {
    id: 26,
    name: "Canagan Cat Soup Tuna",
    price: 1.50,
    category: "Cat Food",
    description: "Premium tuna soup for cats. Rich in omega-3 and made with fresh tuna.",
    status: "in_stock",
    image: "/images/product26.jpg",
    brand: "Canagan",
    weight: "140g",
    protein: "Tuna",
    tags: ["soup", "tuna", "omega-3", "wet food"]
  },

  // Canagan Cat Wet Food - Tuna Varieties
  {
    id: 27,
    name: "Canagan Tuna and Salmon Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with tuna and salmon. Rich in essential fatty acids.",
    status: "in_stock",
    image: "/images/product27.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Tuna & Salmon",
    tags: ["tuna", "salmon", "wet food", "fatty acids"]
  },
  {
    id: 28,
    name: "Canagan Tuna and Mussels Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with tuna and mussels. Natural source of vitamins and minerals.",
    status: "in_stock",
    image: "/images/product28.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Tuna & Mussels",
    tags: ["tuna", "mussels", "vitamins", "minerals"]
  },
  {
    id: 29,
    name: "Canagan Tuna and Crab Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with tuna and crab. Seafood blend for discerning cats.",
    status: "in_stock",
    image: "/images/product29.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Tuna & Crab",
    tags: ["tuna", "crab", "seafood", "premium"]
  },
  {
    id: 30,
    name: "Canagan Ocean Tuna Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with ocean tuna. Single protein source for sensitive cats.",
    status: "in_stock",
    image: "/images/product30.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Ocean Tuna",
    tags: ["ocean tuna", "single protein", "sensitive", "premium"]
  },
  {
    id: 31,
    name: "Canagan Tuna and Prawns Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with tuna and prawns. Delicious seafood combination.",
    status: "in_stock",
    image: "/images/product31.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Tuna & Prawns",
    tags: ["tuna", "prawns", "seafood", "delicious"]
  },

  // Canagan Cat Wet Food - Chicken Varieties
  {
    id: 32,
    name: "Canagan Chicken Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with fresh chicken. High-quality protein for adult cats.",
    status: "in_stock",
    image: "/images/product32.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken",
    tags: ["chicken", "fresh", "high protein", "adult cats"]
  },
  {
    id: 33,
    name: "Canagan Chicken and Sardine Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with chicken and sardine. Perfect blend of poultry and fish.",
    status: "in_stock",
    image: "/images/product33.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken & Sardine",
    tags: ["chicken", "sardine", "poultry", "fish blend"]
  },
  {
    id: 34,
    name: "Canagan Chicken and Seabass Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with chicken and seabass. Nutritious land and sea combination.",
    status: "in_stock",
    image: "/images/product34.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken & Seabass",
    tags: ["chicken", "seabass", "land", "sea", "nutritious"]
  },
  {
    id: 35,
    name: "Canagan Tuna and Chicken Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with tuna and chicken. Best of both worlds protein combination.",
    status: "in_stock",
    image: "/images/product35.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Tuna & Chicken",
    tags: ["tuna", "chicken", "best combination", "premium"]
  },
  {
    id: 36,
    name: "Canagan Chicken and Duck Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with chicken and duck. Rich poultry blend for protein lovers.",
    status: "in_stock",
    image: "/images/product36.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken & Duck",
    tags: ["chicken", "duck", "poultry", "protein rich"]
  },
  {
    id: 37,
    name: "Canagan Chicken and Ham Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with chicken and ham. Savory combination for discerning cats.",
    status: "in_stock",
    image: "/images/product37.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken & Ham",
    tags: ["chicken", "ham", "savory", "discerning"]
  },
  {
    id: 38,
    name: "Canagan Chicken and Crab Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with chicken and crab. Unique land and sea protein blend.",
    status: "in_stock",
    image: "/images/product38.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken & Crab",
    tags: ["chicken", "crab", "unique", "land sea blend"]
  },
  {
    id: 39,
    name: "Canagan Chicken and Prawns Cat Food",
    price: 1.59,
    category: "Cat Food",
    description: "Premium wet cat food with chicken and prawns. Luxurious protein combination.",
    status: "in_stock",
    image: "/images/product39.jpg",
    brand: "Canagan",
    weight: "75g",
    protein: "Chicken & Prawns",
    tags: ["chicken", "prawns", "luxurious", "premium"]
  },

  // Yora Insect-Based Cat Food
  {
    id: 40,
    name: "Yora Nutritious Insects with Oats Beetroot Seaweed",
    price: 8.00,
    category: "Cat Food",
    description: "Sustainable insect-based dry cat food with oats, beetroot, and seaweed. Eco-friendly and nutritious.",
    status: "in_stock",
    image: "/images/product40.jpg",
    brand: "Yora",
    weight: "1.5kg",
    protein: "Insects",
    tags: ["sustainable", "insects", "eco-friendly", "dry food"]
  },
  {
    id: 41,
    name: "Yora Insect Superfood for Cats",
    price: 8.00,
    category: "Cat Food",
    description: "Complete insect-based superfood for cats. Sustainable protein with all essential nutrients.",
    status: "in_stock",
    image: "/images/product41.jpg",
    brand: "Yora",
    weight: "1.5kg",
    protein: "Insects",
    tags: ["superfood", "sustainable", "complete", "essential nutrients"]
  },

  // BIRD FOOD - Wild Bird Range
  {
    id: 42,
    name: "Basics Sunflower Hearts",
    price: 2.00,
    category: "Bird Food",
    description: "Premium sunflower hearts for wild birds. High energy food with no waste shells.",
    status: "out_of_stock",
    image: "/images/product42.jpg",
    brand: "Basics",
    weight: "1kg",
    protein: "Seeds",
    tags: ["sunflower", "high energy", "no waste", "wild birds"]
  },
  {
    id: 43,
    name: "Basics Black Sunflower Seed",
    price: 2.00,
    category: "Bird Food",
    description: "Premium black sunflower seeds for wild birds. Favorite food of many garden birds.",
    status: "out_of_stock",
    image: "/images/product43.jpg",
    brand: "Basics",
    weight: "1kg",
    protein: "Seeds",
    tags: ["black sunflower", "garden birds", "favorite", "premium"]
  },
  {
    id: 44,
    name: "50 x Fat Balls",
    price: 12.50,
    category: "Bird Food",
    description: "Bulk pack of 50 fat balls for wild birds. High-energy winter feed in convenient tub.",
    status: "out_of_stock",
    image: "/images/product44.jpg",
    brand: "Henry Bell",
    weight: "50 balls",
    protein: "Fat & Seeds",
    tags: ["fat balls", "winter feed", "high energy", "bulk pack"]
  },
  {
    id: 45,
    name: "Superior Wild Food",
    price: 5.25,
    category: "Bird Food",
    description: "Premium wild bird food mix. Carefully selected blend for attracting diverse bird species.",
    status: "out_of_stock",
    image: "/images/product45.jpg",
    brand: "Superior",
    weight: "2kg",
    protein: "Mixed Seeds",
    tags: ["wild mix", "diverse species", "premium", "carefully selected"]
  },
  {
    id: 46,
    name: "Johnson and Jeff Robin and Songbird Mix",
    price: 5.25,
    category: "Bird Food",
    description: "Specialist mix for robins and songbirds. High-quality ingredients for smaller garden birds.",
    status: "out_of_stock",
    image: "/images/product46.jpg",
    brand: "Johnson and Jeff",
    weight: "2kg",
    protein: "Mixed Seeds",
    tags: ["robin", "songbird", "specialist", "small birds"]
  },
  {
    id: 47,
    name: "Peckish Extra Goodness Energy Ball - 12 Pack",
    price: 2.50,
    category: "Bird Food",
    description: "Pack of 12 energy balls for wild birds. Extra nutrition for year-round feeding.",
    status: "out_of_stock",
    image: "/images/product47.jpg",
    brand: "Peckish",
    weight: "12 balls",
    protein: "Fat & Seeds",
    tags: ["energy balls", "extra nutrition", "year round", "feeding"]
  }
];

module.exports = rawEssexProducts;