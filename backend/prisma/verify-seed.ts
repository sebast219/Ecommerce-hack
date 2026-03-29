const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== VERIFICACIÓN DE BASE DE DATOS ===\n');
  
  // Verificar categorías
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  console.log('CATEGORÍAS:');
  console.log('-------------------------------------------');
  categories.forEach(cat => {
    const status = cat._count.products >= 2 ? '✓' : '⚠';
    console.log(`${status} ${cat.name}: ${cat._count.products} productos`);
  });
  
  // Verificar productos
  const totalProducts = await prisma.product.count();
  const products = await prisma.product.findMany({
    select: {
      name: true,
      sku: true,
      price: true,
      difficulty: true,
      category: {
        select: { name: true }
      }
    }
  });
  
  console.log(`\nTOTAL PRODUCTOS: ${totalProducts}`);
  console.log('-------------------------------------------');
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} (${p.sku}) - $${p.price} [${p.difficulty}] - ${p.category.name}`);
  });
  
  // Resumen
  console.log('\n=== RESUMEN ===');
  console.log(`✓ Categorías creadas: ${categories.length} (meta: 11)`);
  console.log(`✓ Productos creados: ${totalProducts} (meta: ≥22)`);
  
  const catsWithProducts = categories.filter(c => c._count.products >= 2).length;
  console.log(`✓ Categorías con ≥2 productos: ${catsWithProducts}/${categories.length}`);
  
  if (totalProducts >= 22 && catsWithProducts === categories.length) {
    console.log('\n🎉 ¡SEED COMPLETADO EXITOSAMENTE!');
  } else {
    console.log('\n⚠ Revisar: algunos productos faltantes');
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
