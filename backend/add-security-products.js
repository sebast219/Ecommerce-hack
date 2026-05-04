const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const securityProducts = [
  {
    name: 'USB Rubber Ducky',
    slug: 'usb-rubber-ducky',
    description: 'Advanced USB attack platform for penetration testing',
    price: 79.99,
    sku: 'USB-DUCKY-001',
    trackInventory: true,
    isActive: true,
    images: '["https://example.com/rubber-ducky.jpg"]',
    tags: '["usb", "pentesting", "hardware"]',
    difficulty: 'INTERMEDIATE',
    compatibility: '["Windows", "Linux", "macOS"]',
    tutorials: '["https://docs.hak5.org/rubberducky"]',
    isPhysical: true,
    categoryId: 'cmokhn3kc0000enx0uiegvryo' // Security Tools category
  },
  {
    name: 'WiFi Pineapple Mark VII',
    slug: 'wifi-pineapple-mark-vii',
    description: 'Professional wireless network auditing platform',
    price: 119.99,
    sku: 'WIFI-PINEAPPLE-007',
    trackInventory: true,
    isActive: true,
    images: '["https://example.com/wifi-pineapple.jpg"]',
    tags: '["wifi", "network", "auditing", "hardware"]',
    difficulty: 'ADVANCED',
    compatibility: '["All Platforms"]',
    tutorials: '["https://docs.wifipineapple.com"]',
    isPhysical: true,
    categoryId: 'cmokhn3kc0000enx0uiegvryo'
  },
  {
    name: 'Bash Bunny Mark II',
    slug: 'bash-bunny-mark-ii',
    description: 'Multi-function USB attack tool for automated attacks',
    price: 99.99,
    sku: 'BASH-BUNNY-002',
    trackInventory: true,
    isActive: true,
    images: '["https://example.com/bash-bunny.jpg"]',
    tags: '["usb", "automation", "pentesting", "hardware"]',
    difficulty: 'INTERMEDIATE',
    compatibility: '["Windows", "Linux", "macOS"]',
    tutorials: '["https://docs.hak5.org/bashbunny"]',
    isPhysical: true,
    categoryId: 'cmokhn3kc0000enx0uiegvryo'
  },
  {
    name: 'Flipper Zero',
    slug: 'flipper-zero',
    description: 'Portable multi-tool device for pentesters and geeks',
    price: 179.99,
    sku: 'FLIPPER-ZERO-001',
    trackInventory: true,
    isActive: true,
    images: '["https://example.com/flipper-zero.jpg"]',
    tags: '["portable", "multi-tool", "rf", "hardware"]',
    difficulty: 'BEGINNER',
    compatibility: '["All Platforms"]',
    tutorials: '["https://docs.flipperzero.one"]',
    isPhysical: true,
    categoryId: 'cmokhn3kc0000enx0uiegvryo'
  }
];

async function main() {
  try {
    console.log('Adding security products...');

    for (const productData of securityProducts) {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { sku: productData.sku }
      });

      if (existingProduct) {
        console.log(`Product ${productData.name} already exists, skipping...`);
        continue;
      }

      // Create product
      const product = await prisma.product.create({
        data: {
          ...productData,
          inventory: {
            create: {
              quantity: 50,
              lowStock: 10,
              track: true
            }
          }
        },
        include: {
          inventory: true,
          category: true
        }
      });

      console.log(`Created product: ${product.name} (SKU: ${product.sku})`);
    }

    console.log('Security products added successfully!');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
