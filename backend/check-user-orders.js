const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserOrders() {
  try {
    const email = 'sebayepa219@gmail.com';
    
    // Get user first
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('👤 Usuario:', user);
    
    // Get ALL orders for this user
    const allOrders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📦 Total de pedidos del usuario: ${allOrders.length}`);
    
    if (allOrders.length > 0) {
      console.log('\n📋 Lista de todos los pedidos:');
      allOrders.forEach((order, index) => {
        console.log(`${index + 1}. ID: ${order.id}`);
        console.log(`   Order Number: ${order.orderNumber}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: $${order.total}`);
        console.log(`   Created: ${order.createdAt}`);
        console.log(`   Items: ${order.items.length}`);
        console.log('---');
      });
    } else {
      console.log('❌ El usuario no tiene pedidos');
    }

    // Check if there are more orders in the database (for other users)
    const totalOrdersInDB = await prisma.order.count();
    console.log(`\n🗄️ Total de pedidos en toda la BD: ${totalOrdersInDB}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserOrders();
