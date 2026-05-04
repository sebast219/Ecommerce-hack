const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');

    // 1. Crear categoría
    const category = await prisma.category.create({
      data: {
        name: 'Security Tools',
        slug: 'security-tools',
        description: 'Professional security testing tools',
      },
    });
    console.log('Category created:', category);

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
        lowStockThreshold: 10,
        reservedQuantity: 0,
      },
    });
    console.log('Inventory created:', inventory);

    // 4. Crear dirección para el usuario
    const address = await prisma.address.create({
      data: {
        userId: 'cmokhkgl0000013bem08ugfh4', // ID del usuario que creamos
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
        isDefault: true,
        type: 'SHIPPING',
      },
    });
    console.log('Address created:', address);

    console.log('Test data created successfully!');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
