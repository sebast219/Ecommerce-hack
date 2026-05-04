const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createInventory() {
  try {
    console.log('Creating inventory for product...');

    // Verificar si ya existe inventario
    const existingInventory = await prisma.productInventory.findFirst({
      where: { productId: 'cmokhnxna0001jv3sy80szasr' }
    });

    if (existingInventory) {
      console.log('Inventory already exists:', existingInventory);
      // Actualizar cantidad
      const updated = await prisma.productInventory.update({
        where: { id: existingInventory.id },
        data: { quantity: 100 }
      });
      console.log('Inventory updated:', updated);
    } else {
      // Crear nuevo inventario
      const inventory = await prisma.productInventory.create({
        data: {
          productId: 'cmokhnxna0001jv3sy80szasr',
          quantity: 100,
          lowStock: 10,
          track: true,
        },
      });
      console.log('Inventory created:', inventory);
    }

    console.log('Inventory setup completed!');
  } catch (error) {
    console.error('Error creating inventory:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInventory();
