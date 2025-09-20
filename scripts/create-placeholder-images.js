const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating category-specific placeholder images...');

const placeholdersDir = path.join(__dirname, '../public/images/placeholders');

// Ensure directory exists
if (!fs.existsSync(placeholdersDir)) {
    fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Define placeholder image configurations
const placeholders = [
    {
        filename: 'dog-raw-food.jpg',
        text: 'Raw Dog\nFood',
        color: '#8B4513', // Brown
        description: 'Raw meat and natural dog food products'
    },
    {
        filename: 'dog-treats.jpg',
        text: 'Dog\nTreats',
        color: '#DAA520', // Goldenrod
        description: 'Natural chews and training treats'
    },
    {
        filename: 'dog-supplements.jpg',
        text: 'Dog\nSupplements',
        color: '#228B22', // Forest Green
        description: 'Health supplements and vitamins'
    },
    {
        filename: 'dog-accessories.jpg',
        text: 'Dog\nAccessories',
        color: '#4169E1', // Royal Blue
        description: 'Collars, leads, and accessories'
    },
    {
        filename: 'cat-wet-food.jpg',
        text: 'Cat Wet\nFood',
        color: '#FF6347', // Tomato
        description: 'Premium wet food for cats'
    },
    {
        filename: 'cat-dry-food.jpg',
        text: 'Cat Dry\nFood',
        color: '#CD853F', // Peru
        description: 'Nutritious dry kibble for cats'
    },
    {
        filename: 'cat-treats.jpg',
        text: 'Cat\nTreats',
        color: '#DDA0DD', // Plum
        description: 'Delicious treats for cats'
    },
    {
        filename: 'cat-supplements.jpg',
        text: 'Cat\nSupplements',
        color: '#20B2AA', // Light Sea Green
        description: 'Health supplements for cats'
    },
    {
        filename: 'cat-raw-food.jpg',
        text: 'Cat Raw\nFood',
        color: '#B22222', // Fire Brick
        description: 'Raw food for cats'
    },
    {
        filename: 'dog-dry-food.jpg',
        text: 'Dog Dry\nFood',
        color: '#A0522D', // Sienna
        description: 'Premium dry dog food'
    },
    {
        filename: 'dog-wet-food.jpg',
        text: 'Dog Wet\nFood',
        color: '#DC143C', // Crimson
        description: 'Wet food pouches for dogs'
    },
    {
        filename: 'bone-broth.jpg',
        text: 'Bone\nBroth',
        color: '#8B4513', // Saddle Brown
        description: 'Nutritious bone broths'
    },
    {
        filename: 'bird-food.jpg',
        text: 'Bird\nFood',
        color: '#FFD700', // Gold
        description: 'Seeds and treats for birds'
    },
    {
        filename: 'small-animal-food.jpg',
        text: 'Small Animal\nFood',
        color: '#32CD32', // Lime Green
        description: 'Food for rabbits and small pets'
    },
    {
        filename: 'pet-toys.jpg',
        text: 'Pet\nToys',
        color: '#FF1493', // Deep Pink
        description: 'Fun toys for pets'
    },
    {
        filename: 'bulk-food.jpg',
        text: 'Bulk\nFood',
        color: '#696969', // Dim Gray
        description: 'Bulk and breeder packs'
    },
    {
        filename: 'cold-pressed-food.jpg',
        text: 'Cold Pressed\nFood',
        color: '#4682B4', // Steel Blue
        description: 'Cold pressed nutrition'
    },
    {
        filename: 'freeze-dried-treats.jpg',
        text: 'Freeze Dried\nTreats',
        color: '#9370DB', // Medium Purple
        description: 'Freeze dried treats'
    },
    {
        filename: 'feeding-bowls.jpg',
        text: 'Feeding\nBowls',
        color: '#708090', // Slate Gray
        description: 'Bowls and feeding accessories'
    },
    {
        filename: 'fish-treats.jpg',
        text: 'Fish\nTreats',
        color: '#1E90FF', // Dodger Blue
        description: 'Fish-based treats'
    },
    {
        filename: 'pet-product.jpg',
        text: 'Pet\nProduct',
        color: '#666666', // Gray
        description: 'General pet product'
    }
];

// Function to create a placeholder image
async function createPlaceholder(config) {
    try {
        const { filename, text, color, description } = config;
        const outputPath = path.join(placeholdersDir, filename);

        // Create SVG content
        const svgContent = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="${color}" opacity="0.1"/>
            <rect x="20" y="20" width="360" height="360" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="10,5"/>

            <!-- Main icon background -->
            <circle cx="200" cy="150" r="60" fill="${color}" opacity="0.2"/>

            <!-- Product text -->
            <text x="200" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${color}">
                ${text.split('\n').map((line, index) =>
                    `<tspan x="200" dy="${index === 0 ? 0 : 35}">${line}</tspan>`
                ).join('')}
            </text>

            <!-- Raw Essex branding -->
            <text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${color}" opacity="0.7">
                Raw Essex
            </text>

            <!-- Description -->
            <text x="200" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${color}" opacity="0.6">
                ${description}
            </text>

            <!-- Placeholder indicator -->
            <text x="200" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="${color}" opacity="0.5">
                Placeholder Image - Replace with Product Photo
            </text>
        </svg>`;

        // Convert SVG to JPEG using Sharp
        await sharp(Buffer.from(svgContent))
            .jpeg({ quality: 85 })
            .toFile(outputPath);

        console.log(`✅ Created: ${filename}`);
        return true;
    } catch (error) {
        console.error(`❌ Error creating ${config.filename}:`, error.message);
        return false;
    }
}

// Main function to create all placeholders
async function createAllPlaceholders() {
    console.log(`🎨 Creating ${placeholders.length} placeholder images...`);

    let successCount = 0;

    for (const config of placeholders) {
        const success = await createPlaceholder(config);
        if (success) {
            successCount++;
        }

        // Small delay between creations
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Successfully created ${successCount}/${placeholders.length} placeholder images`);
    console.log(`📁 Placeholder images saved to: ${placeholdersDir}`);

    return successCount;
}

// Run the script
createAllPlaceholders()
    .then((count) => {
        console.log(`\n🎉 Placeholder image creation complete!`);
        console.log(`📸 ${count} category-specific placeholder images ready`);
        console.log(`🔧 These can now be replaced with actual product photos`);
    })
    .catch((error) => {
        console.error('❌ Error during placeholder creation:', error);
    });