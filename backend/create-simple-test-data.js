const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSimpleTestData() {
  try {
    console.log('Creating simple test data...');

    // 1. Obtener o crear categoría
    let category = await prisma.category.findFirst({
      where: { slug: 'security-tools' }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Security Tools',
          slug: 'security-tools',
          description: 'Professional security testing tools',
        },
      });
      console.log('Category created:', category);
    } else {
      console.log('Category found:', category);
    }

    // 2. Crear producto
    const product = await prisma.product.create({
      data: {
        name: 'NMAP Pro',
        slug: 'nmap-pro',
        description: 'Professional network mapping and scanning tool',
        price: 49.99,
        sku: 'NMAP-PRO-001',
        categoryId: category.id,
        images: JSON.stringify(['https://example.com/nmap.jpg']),
        tags: JSON.stringify(['network', 'scanner', 'security']),
        compatibility: JSON.stringify(['Windows', 'Linux', 'macOS']),
        tutorials: JSON.stringify(['https://example.com/tutorial']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
      },
    });
    console.log('Product created:', product);

    // 3. Crear inventario
    const inventory = await prisma.productInventory.create({
      data: {
        productId: product.id,
        quantity: 100,
        lowStock: 10,
        track: true,
      },
    });
    console.log('Inventory created:', inventory);

    console.log('Test data created successfully!');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleTestData();
