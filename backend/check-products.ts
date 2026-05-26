import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        inventory: true,
      },
    });

    console.log(`Total de productos en la base de datos: ${products.length}`);
    
    if (products.length === 0) {
      console.log('No hay productos en la base de datos.');
    } else {
      console.log('\nProductos encontrados:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Precio: $${product.price}`);
        console.log(`   Categoría: ${product.category.name}`);
        console.log(`   Stock: ${product.inventory?.quantity || 'N/A'}`);
        console.log(`   Activo: ${product.isActive ? 'Sí' : 'No'}`);
      });
    }
  } catch (error) {
    console.error('Error al consultar productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
