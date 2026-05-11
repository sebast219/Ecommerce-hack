import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('=== Categorías existentes en la base de datos ===');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   Slug: ${category.slug}`);
      console.log(`   Productos: ${category._count.products}`);
      console.log(`   Activa: ${category.isActive}`);
      console.log(`   Descripción: ${category.description || 'Sin descripción'}`);
      console.log('');
    });
    
    console.log('\n=== Categorías mencionadas por el usuario ===');
    const userCategories = [
      'Profesionales',
      'Ataques Inalámbricos', 
      'USB Hacking',
      'Red Team',
      'Network',
      'Hardware'
    ];
    
    userCategories.forEach(cat => {
      const exists = categories.some(c => c.name === cat);
      console.log(`${exists ? '✅' : '❌'} ${cat}`);
    });
    
  } catch (error) {
    console.error('Error al verificar categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
